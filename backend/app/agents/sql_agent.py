# IMPORTS
from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
from langchain_core.messages import AIMessage, BaseMessage
from typing import Annotated, TypedDict, Any
from datetime import datetime, timezone
from .. import crud
from ..database import SessionLocal
from .prompts import get_system_prompt
import json
import traceback

# --- STATE ---
class SQLAgentState(TypedDict):
    messages: Annotated[list, add_messages]
    sql_attempts: int
    sql_error_count: int
    sql_query: str | None
    sql_result: Any | None
    current_node: str

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
        async def agent_node(state):
            return await self.call_model(state, session)
        async def execute_sql_node(state):
            return await self.execute_sql(state, session)
        async def llm_with_results_node(state):
            return await self.llm_with_results(state, session)
        graph.add_node("agent", agent_node)
        graph.add_node("execute_sql", execute_sql_node)
        graph.add_node("llm_with_results", llm_with_results_node)
        graph.set_entry_point("agent")
        # Conditional edge after agent_node: is SQL possible?
        graph.add_conditional_edges(
            "agent",
            self.is_sql_possible,
            {"execute_sql": "execute_sql", "end": "__end__"}
        )
        # Conditional edge after execute_sql_node: success or error?
        graph.add_conditional_edges(
            "execute_sql",
            self.is_sql_success,
            {"llm_with_results": "llm_with_results", "retry": "agent", "end": "__end__"}
        )
        # After llm_with_results, always end
        graph.add_edge("llm_with_results", "__end__")
        return graph.compile()

    def is_sql_possible(self, state):
        # If a SQL query was generated, proceed; else, end
        return "execute_sql" if state.get("sql_query") else "end"

    def is_sql_success(self, state):
        # If SQL result is not None and no error, proceed to LLM with results
        if state.get("sql_result") is not None:
            return "llm_with_results"
        # If error count < 3, retry
        if state.get("sql_error_count", 0) < 3:
            return "retry"
        # Otherwise, end
        return "end"

    async def call_model(self, state, session):
        messages = state["messages"]
        # LLM generates SQL or limitation message
        response = await self.llm.ainvoke(messages)
        sql_query = self.extract_sql_from_response(response)
        new_state = state.copy()
        new_state["messages"] = messages + [response]
        new_state["sql_query"] = sql_query
        return new_state

    async def execute_sql(self, state, session):
        sql_query = state.get("sql_query")
        error_count = state.get("sql_error_count", 0)
        result = None
        try:
            db = session.db or SessionLocal()
            result = db.execute(sql_query).fetchall() if sql_query else None
            db.close()
            new_state = state.copy()
            new_state["sql_result"] = result
            new_state["sql_error_count"] = error_count
            return new_state
        except Exception as e:
            new_state = state.copy()
            new_state["sql_result"] = None
            new_state["sql_error_count"] = error_count + 1
            return new_state

    async def llm_with_results(self, state, session):
        # LLM uses SQL results to answer
        messages = state["messages"]
        sql_result = state.get("sql_result")
        # Add SQL result as a message for the LLM
        result_message = {"role": "system", "content": f"SQL Results: {sql_result}"}
        response = await self.llm.ainvoke(messages + [result_message])
        new_state = state.copy()
        new_state["messages"] = messages + [result_message, response]
        return new_state

    def extract_sql_from_response(self, response):
        # Try to extract SQL from LLM response (simple heuristic)
        content = getattr(response, "content", "")
        if "SELECT" in content.upper():
            # Naive: return the first code block or line with SELECT
            lines = content.splitlines()
            for line in lines:
                if "SELECT" in line.upper():
                    return line.strip('` ')
        return None

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
            "sql_error_count": 0,
            "sql_query": None,
            "sql_result": None,
            "current_node": "__start__"
        }
        try:
            async for step in self.app.astream(initial_state, stream_mode="values"):
                # print(f"[SQLAgentSession ainvoke] step: {step}")
                messages = step["messages"]
                current_node = step.get("current_node", "")
                if current_node == "__end__":
                    if messages:
                        this_message = messages[-1]
                        yield {
                            "step_type": "final_response",
                            "message": this_message,
                            "is_thinking": False,
                        }
                    break
                if current_node == "__start__":
                    continue
                this_message = messages[-1]
                yield {
                    "step_type": "step",
                    "message": this_message.get("content", str(this_message)),
                    "is_thinking": True,
                }
        except Exception as e:
            tb_str = traceback.format_exc()
            yield {
                "step_type": "error",
                "message": str(e),
                "is_thinking": True,
            }
