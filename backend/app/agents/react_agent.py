## IMPORTS ##
# AI Libraries
from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
from langchain_core.messages import AIMessage, ToolMessage, BaseMessage
from langgraph.prebuilt import ToolNode
# Other Libraries
from typing import Annotated, Literal, AsyncGenerator
from typing_extensions import TypedDict
import os
from dotenv import load_dotenv
import asyncio
from datetime import datetime, timezone
from .. import crud
load_dotenv()
import traceback
from .tools import get_react_agent_tools
import json
import inspect
from .prompts import get_system_prompt

# Custom messages for function calls
default_function_call_message = "Calling function..."
FUNCTION_CALL_MESSAGES = {
    "get_referral_link": "Getting referral link...",
    # Add more mappings as needed
}

## REACT AGENT IN LANGCHAIN ##
class ReactAgentState(TypedDict):
    messages: Annotated[list, add_messages]
    current_node: str

# --- Singleton Core ---
class ReactAgentCore:
    _instance = None

    def __init__(self, llm_with_tools):
        self.llm_with_tools = llm_with_tools
        self.graph = StateGraph(ReactAgentState)
        self.tool_node = ToolNode(get_react_agent_tools())

    @classmethod
    def get_instance(cls, llm_with_tools):
        if cls._instance is None:
            cls._instance = cls(llm_with_tools)
        return cls._instance

    def setup_graph(self, session):
        graph = StateGraph(ReactAgentState)
        async def agent_node(state):
            return await self.call_model(state, session)
        async def action_node(state):
            return await self.call_tool(state, session)
        graph.add_node("agent", agent_node)
        graph.add_node("action", action_node)
        graph.set_entry_point("agent")
        graph.add_conditional_edges(
            "agent",
            self.should_continue,
            {"action": "action", "end": "__end__"}
        )
        graph.add_edge("action", "agent")
        return graph.compile()

    def should_continue(self, state):
        messages = state["messages"]
        if not messages:
            return "end"
        this_message = messages[-1]
        tool_calls = getattr(this_message, "additional_kwargs", {}).get("tool_calls", None)
        if tool_calls and len(tool_calls) > 0:
            return "action"
        return "end"

    async def call_model(self, state, session):
        messages = state["messages"]
        response = await self.llm_with_tools.ainvoke(messages)
        new_messages = messages + [response]
        message_to_post = getattr(response, 'content', str(response))
        if message_to_post == "":
            tool_calls = getattr(response, "additional_kwargs", {}).get("tool_calls", None)
            if tool_calls and len(tool_calls) > 0:
                tool_call = tool_calls[0]
                func_name = tool_call["function"]["name"]
                params = tool_call["function"]["arguments"]
                message_to_post = f"function_call: '{func_name}', params: '{params}'"
        if session.db:
            timestamp = datetime.now(timezone.utc).isoformat()
            if getattr(response, 'content', None) == "":
                tool_calls = getattr(response, "additional_kwargs", {}).get("tool_calls", None)
                if tool_calls and len(tool_calls) > 0:
                    tool_call = tool_calls[0]
                    message_to_post = json.dumps({
                        "type": "tool_call",
                        "tool_call": tool_call
                    })
                    sender_type = "tool_call"
                else:
                    sender_type = "bot"
            else:
                sender_type = "bot"
            crud.add_conversation_message(
                db=session.db,
                user_id=session.user_id,
                message=message_to_post,
                sender=sender_type,
                timestamp=timestamp,
                conversation_id=session.conversation_id
            )
        return {"messages": new_messages, "current_node": "call_model"}

    def message_to_dict(self, msg):
        if isinstance(msg, dict):
            return msg
        if hasattr(msg, "dict"):
            return msg.dict()
        if hasattr(msg, "to_dict"):
            return msg.to_dict()
        return vars(msg)

    async def call_tool(self, state, session):
        messages = state["messages"]
        try:
            tool_result = await self.tool_node.ainvoke({"messages": messages})
            tool_response = self.message_to_dict(tool_result.get("messages", [None])[-1])
            tool_text = tool_result.get("messages", [None])[-1].content if tool_result.get("messages") else None
            new_messages = messages + [tool_response]
            if session.db and tool_response is not None:
                timestamp = datetime.now(timezone.utc).isoformat()
                if "tool_call_id" in tool_response:
                    message_to_post = json.dumps({
                        "type": "tool_response",
                        "tool_call_id": tool_response["tool_call_id"],
                        "content": tool_response["content"]
                    })
                    sender_type = "tool_response"
                    crud.add_conversation_message(
                        db=session.db,
                        user_id=session.user_id,
                        message=message_to_post,
                        sender=sender_type,
                        timestamp=timestamp,
                        conversation_id=session.conversation_id
                    )
        except Exception as e:
            tool_text = f"[Tool error: {e}]"
            new_messages = messages
        if session.db and tool_response is not None:
            timestamp = datetime.now(timezone.utc).isoformat()
            crud.add_conversation_message(
                db=session.db,
                user_id=session.user_id,
                message=tool_text,
                sender="tool_response",
                timestamp=timestamp,
                conversation_id=session.conversation_id
            )
        return {"messages": new_messages, "current_node": "call_tool"}

# --- Per-request Session ---
class ReactAgentSession:
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
        system_prompt = get_system_prompt('ReactAgent')
        system_message = {"role": "system", "content": system_prompt}
        messages = [system_message]
        if self.db and self.conversation_id is not None:
            history = crud.get_conversation_messages(self.db, self.conversation_id)
            for row in history:
                try:
                    msg_data = json.loads(row.message)
                    if row.sender == "tool_call" and msg_data.get("type") == "tool_call":
                        messages.append({
                            "role": "assistant",
                            "content": None,
                            "tool_calls": [msg_data["tool_call"]]
                        })
                    elif row.sender == "tool_response" and msg_data.get("type") == "tool_response":
                        messages.append({
                            "role": "tool",
                            "tool_call_id": msg_data["tool_call_id"],
                            "content": msg_data["content"]
                        })
                    else:
                        role = (
                            "user" if row.sender == "user" else
                            "assistant" if row.sender == "bot" else
                            "tool" if row.sender == "tool" else
                            "assistant"
                        )
                        messages.append({
                            "role": role,
                            "content": row.message
                        })
                except Exception:
                    role = (
                        "user" if row.sender == "user" else
                        "assistant" if row.sender == "bot" else
                        "tool" if row.sender == "tool" else
                        "assistant"
                    )
                    messages.append({
                        "role": role,
                        "content": row.message
                    })
            return messages
        messages.append({"role": "user", "content": self.user_message})
        return messages

    async def ainvoke(self):
        messages = self.get_initial_messages()
        initial_state = {
            "messages": messages,
            "current_node": "__start__"
        }
        try:
            async for step in self.app.astream(initial_state, stream_mode="values"):
                messages = step["messages"]
                current_node = step["current_node"]
                if current_node == "__end__":
                    if messages:
                        this_message = messages[-1]
                        if this_message.get("role") == "assistant":
                            yield {
                                "step_type": "final_response",
                                "message": messages[-1],
                                "is_thinking": False,
                            }
                    break
                if current_node == "__start__":
                    continue
                this_message = messages[-1]
                if not is_function_call(this_message):
                    this_message = self.core.message_to_dict(this_message)
                    text_for_ui = this_message.get("content", "")
                    yield {
                        "step_type": "step",
                        "message": text_for_ui,
                        "is_thinking": False,
                    }
                else:
                    if is_function_call(this_message):
                        if len(messages) >= 2:
                            prior_message = messages[-2]
                            if is_function_call(prior_message):
                                tool_calls = prior_message.additional_kwargs.get("tool_calls", [])
                                func_name = tool_calls[0]["function"]["name"] if tool_calls else None
                                custom_msg = FUNCTION_CALL_MESSAGES.get(func_name, f"Calling function: {func_name}..." if func_name else default_function_call_message)
                                yield {
                                    "step_type": "step",
                                    "message": custom_msg,
                                    "is_thinking": True,
                                }
                    pass
        except Exception as e:
            tb_str = traceback.format_exc()
            print(f"[ReactAgent ainvoke] error: {tb_str}")
            yield {
                "step_type": "error",
                "message": str(e),
                "is_thinking": True,
            }

def is_function_call(message: BaseMessage) -> bool:
    if isinstance(message, AIMessage):
        tool_calls = message.additional_kwargs.get("tool_calls", [])
        return len(tool_calls) > 0
    elif isinstance(message, ToolMessage):
        # ToolMessage implies a function has already been called and responded
        return True
    return False