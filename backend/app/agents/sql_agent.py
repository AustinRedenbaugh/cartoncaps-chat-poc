# IMPORTS
from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
from langchain_core.messages import AIMessage, BaseMessage
from typing import Annotated, TypedDict, Any, Literal
from datetime import datetime, timezone
from .. import crud
from ..database import SessionLocal
from .prompts import get_system_prompt
import json
import traceback
from pydantic import BaseModel, Field, create_model
from sqlalchemy import text
import re

# --- STATE ---
class SQLAgentState(TypedDict):
    messages: Annotated[list, add_messages]
    sql_attempts: int
    sql_query: str | None
    sql_result: Any | None
    final_result: str | None
    current_node: str
    table_name: str | None

# --- STRUCTURED OUTPUT ---
def get_sql_feedback_model(user_id: int):
    return create_model(
        'SQLFeedback',
        possible=(bool, Field(
            description=f"Return True if there exists an SQL query that would be helpful to answer the user's question, False otherwise. The user_id is {user_id} (do not ask the user for it)."
        )),
        content=(str, Field(
            description=f"Return an SQL query, the results of which would be helpful in answering the user's question. If no such helpful SQL query exists, return a string that explains why no such query exists. The user_id is {user_id}, you may need to use this value in your query (do not ask the user for it)."
        )),
        table_name=(Literal['Products', 'Purchase_History'], Field(
            description="Indicate the name of the table the SQL query is getting results from. Must be one of: 'Products', 'Purchase_History'."
        )),
        __base__=BaseModel
    )

# --- AGENT CORE ---
class SQLAgentCore:
    _instance = None
    _last_user_id = None

    def __init__(self, llm, user_id):
        self.llm = llm
        self.graph = StateGraph(SQLAgentState)
        self.user_id = user_id

    @classmethod
    def get_instance(cls, llm, user_id):
        if cls._instance is None or cls._last_user_id != user_id:
            cls._instance = cls(llm, user_id)
            cls._last_user_id = user_id
        return cls._instance

    def setup_graph(self, session):
        graph = StateGraph(SQLAgentState)
        async def generate_sql_node(state):
            return await self.generate_sql(state, session)
        async def execute_sql_node(state):
            return await self.execute_sql(state, session)
        graph.add_node("generate_sql", generate_sql_node)
        graph.add_node("execute_sql", execute_sql_node)
        graph.set_entry_point("generate_sql")
        # Conditional edge after generate_sql_node: is SQL possible?
        graph.add_conditional_edges(
            "generate_sql",
            self.is_sql_possible,
            {"execute_sql": "execute_sql", "end": "__end__"}
        )
        # Conditional edge after execute_sql_node: success or error?
        graph.add_conditional_edges(
            "execute_sql",
            self.is_sql_success,
            {"retry": "generate_sql", "end": "__end__"}
        )
        return graph.compile()

    def is_sql_possible(self, state):
        return "execute_sql" if state["sql_possible"] else "end"

    def is_sql_success(self, state):
        # If SQL result is not None and no error, proceed to LLM with results
        try:
            if state["sql_result"] is None and state["sql_attempts"] < 3:
                return "retry"
            # Otherwise, end
            return "end"
        except Exception as e:
            print(f"[SQLAgent is_sql_success] error: {e}")
            return "end"

    async def generate_sql(self, state, session):
        messages = state["messages"]
        state["current_node"] = "generate_sql"
        # print(f"[SQLAgent generate_sql] messages: {messages}")
        try:
            SQLFeedback = get_sql_feedback_model(self.user_id)
            llm_structured = self.llm.with_structured_output(SQLFeedback)
            
            feedback: SQLFeedback = await llm_structured.ainvoke(messages) # type: ignore
            state["sql_attempts"] += 1
            state["sql_possible"] = feedback.possible
            print(f"[SQLAgent generate_sql] sql_query: {feedback.content}")
            state["sql_query"] = feedback.content if feedback.possible else None
            state["final_result"] = feedback.content if not feedback.possible else None
            # Use table_name from feedback
            if feedback.possible:
                state["table_name"] = feedback.table_name
            else:
                state["table_name"] = None
            return state
        except Exception as e:
            print(f"[SQLAgent generate_sql] error: {e}")
            return state

    async def execute_sql(self, state, session):
        state["current_node"] = "execute_sql"
        sql_query = state["sql_query"]
        table_name = state["table_name"]
        result = None
        # POOP!
        try:
            print(f"[SQLAgent execute_sql] sql_query: {sql_query}")            
            print(f"[SQLAgent execute_sql] table_name: {table_name}")
            db = session.db
            result = db.execute(text(sql_query)).fetchall() if sql_query else None
            print(f"[SQLAgent execute_sql] result: {result}")
            db.close()
            state["sql_result"] = result
            state["final_result"] = formatted_result(result, table_name)
            state["current_node"] = "__end__"
            print(f"[SQLAgent execute_sql] final_result: {state['final_result']}")
            return state
        except Exception as e:
            print(f"[SQLAgent execute_sql] error: {e}")
            state["sql_result"] = None
            state["final_result"] = "Unable to retrieve helpful info... latest error: " + str(e)
            new_message = AIMessage(content=state["final_result"])
            state["messages"].append(new_message)
            return state

# --- SESSION ---
class SQLAgentSession:
    def __init__(self, core, user_id, user_message, conversation_id, db):
        self.core = core
        self.set_initial_state(user_id, user_message, conversation_id, db)
        self.app = self.core.setup_graph(self)

    def set_initial_state(self, user_id, user_message, conversation_id, db):
        self.user_id = user_id
        self.user_message = user_message
        self.conversation_id = conversation_id
        self.db = db

    def get_initial_messages(self):
        system_prompt = get_system_prompt('SQLAgent')
        system_message = {"role": "system", "content": system_prompt}
        messages = [system_message, {"role": "user", "content": self.user_message}]
        return messages

    async def ainvoke(self):
        messages = self.get_initial_messages()
        initial_state = {
            "messages": messages,
            "sql_attempts": 0,
            "sql_query": None,
            "sql_result": None,
            "final_result": None,
            "table_name": None,
            "current_node": "__start__",
        }
        try:
            async for step in self.app.astream(initial_state, stream_mode="values"):
                current_node = step["current_node"]
                print(f"[SQLAgentSession ainvoke] current_node: {current_node}")
                if current_node == "__end__":
                    print(f"[SQLAgentSession ainvoke] final_result: {step['final_result']}")
                    yield {
                        "step_type": "final_response",
                        "message": step["final_result"],
                        "is_thinking": False,
                    }
                    break
        except Exception as e:
            tb_str = traceback.format_exc()
            print(f"[SQLAgentSession ainvoke] error: {e}")
            print(f"[SQLAgentSession ainvoke] traceback: {tb_str}")
            yield {
                "step_type": "error",
                "message": str(e),
                "is_thinking": True,
            }

# --- FORMATTED RESULT ---
def formatted_result(result, table_name=None):
    if not result:
        return "No results found."
    label = table_name if table_name else "Row"
    formatted_rows = []
    for row in result:
        # Use SQLAlchemy's row._mapping for robust column extraction
        if hasattr(row, "_mapping"):
            row_dict = dict(row._mapping)
        elif isinstance(row, dict):
            row_dict = row
        else:
            # Fallback: use col1, col2, ...
            row_dict = {f"col{i+1}": v for i, v in enumerate(row)}
        fields = ", ".join([f"'{k}': {repr(v)}" for k, v in row_dict.items()])
        formatted_rows.append(f"{label}({fields})")
    return "[" + ", ".join(formatted_rows) + "]"
