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

class ReactAgent:
    def __init__(self, llm_with_tools, user_id, user_message, db=None):
        self.llm_with_tools = llm_with_tools
        self.user_id = user_id
        self.user_message = user_message
        self.db = db
        self.graph = StateGraph(ReactAgentState)
        self.tool_node = ToolNode(get_react_agent_tools())
        self._setup_graph()

    def get_initial_messages(self, user_id):
        # Return just the list of messages
        return [{"role": "user", "content": self.user_message}]

    async def call_model(self, state):
        messages = state["messages"]
        # Call the LLM with the current messages
        response = await self.llm_with_tools.ainvoke(messages)
        print(f"response: {response}")
        new_messages = messages + [response]

        message_to_post = getattr(response, 'content', str(response))
        if message_to_post == "": # Handle function calls
            tool_calls = getattr(response, "additional_kwargs", {}).get("tool_calls", None)
            # print(f"[ReactAgent call_model] tool_calls: {tool_calls}")
            if tool_calls and len(tool_calls) > 0:
                tool_call = tool_calls[0]
                func_name = tool_call["function"]["name"]
                params = tool_call["function"]["arguments"]
                message_to_post = f"function_call: '{func_name}', params: '{params}'"
        print(f"[ReactAgent call_model] message_to_post: {message_to_post}")

        # Add to Conversation_History if db is available
        if self.db:
            timestamp = datetime.now(timezone.utc).isoformat()
            crud.add_conversation_message(
                db=self.db,
                user_id=self.user_id,
                message=message_to_post,
                sender="bot",
                timestamp=timestamp
            )
        # print(f"[ReactAgent call_model] new_messages: {new_messages}")
        return {"messages": new_messages, "current_node": "call_model"}

    def message_to_dict(self, msg):
        # If already a dict, return as is
        if isinstance(msg, dict):
            return msg
        # If LangChain message, try .dict() or .to_dict()
        if hasattr(msg, "dict"):
            return msg.dict()
        if hasattr(msg, "to_dict"):
            return msg.to_dict()
        # Fallback: use vars
        return vars(msg)

    async def call_tool(self, state):
        messages = state["messages"]
        try:
            tool_result = await self.tool_node.ainvoke({"messages": messages})
            # tool_result['messages'] is a list of ToolMessage(s)
            tool_response = self.message_to_dict(tool_result.get("messages", [None])[-1])
            print(f"Xtool_response: {tool_response}")
            tool_text = tool_result.get("messages", [None])[-1].content if tool_result.get("messages") else None
            new_messages = messages + [tool_response]
        except Exception as e:
            tool_text = f"[Tool error: {e}]"
            new_messages = messages
        print(f"[ReactAgent call_tool] tool_text: {tool_text}")
        # Add to Conversation_History if db is available
        if self.db and tool_response is not None:
            timestamp = datetime.now(timezone.utc).isoformat()
            crud.add_conversation_message(
                db=self.db,
                user_id=self.user_id,
                message=tool_text,
                sender="bot",
                timestamp=timestamp
            )
        # print(f"[ReactAgent call_tool] new_messages: {new_messages}")
        return {"messages": new_messages, "current_node": "call_tool"}

    def should_continue(self, state):
        messages = state["messages"]
        if not messages:
            return "end"
        this_message = messages[-1]
        tool_calls = getattr(this_message, "additional_kwargs", {}).get("tool_calls", None)
        if tool_calls and len(tool_calls) > 0:
            print("[ReactAgent should_continue] : action (function call detected)")
            return "action"
        print("[ReactAgent should_continue]: end")
        return "end"

    def _setup_graph(self):
        """Setup the LangGraph workflow with agent and action nodes and conditional edge."""
        self.graph.add_node("agent", self.call_model)
        self.graph.add_node("action", self.call_tool)
        self.graph.set_entry_point("agent")
        self.graph.add_conditional_edges(
            "agent",
            self.should_continue,
            {"action": "action", "end": "__end__"}
        )
        self.graph.add_edge("action", "agent")
        self.app = self.graph.compile()

    async def ainvoke(self) -> AsyncGenerator[dict, None]:
        """Async generator: yields each step, and yields a final response at the end."""
        messages = self.get_initial_messages(self.user_id)
        initial_state = {
            "messages": messages,
            "current_node": "__start__"
        }
        try:
            async for step in self.app.astream(initial_state, stream_mode="values"):
                print(f"step: {step}")
                messages = step["messages"]
                current_node = step["current_node"]
                # print(f"current_node: {current_node}")

                # If this is the final step, yield a final response and break
                if current_node == "__end__":
                    if messages:
                        this_message = messages[-1]
                        if this_message.get("role") == "assistant":
                            yield {
                                "step_type": "final_response",
                                "message": messages[-1],
                            }
                    break
                
                if current_node == "__start__":
                    continue

                # Yield depending on UI Update is desired 
                this_message = messages[-1]
                if not is_function_call(this_message):
                    print(f"not func: this_message: {this_message.content}")
                    this_message = self.message_to_dict(this_message)
                    text_for_ui = this_message.get("content", "")
                    yield {
                        "step_type": "step",
                        "message": text_for_ui,
                    }
                else:
                    print(f"func: this_message: {this_message.content}")
                    if is_function_call(this_message):
                        # Get custom message to indicate the function being called
                        if len(messages) >= 2:
                            prior_message = messages[-2]
                            if is_function_call(prior_message):
                                print("Here1")
                                # Get custom message to indicate the function being called
                                tool_calls = prior_message.additional_kwargs.get("tool_calls", [])
                                func_name = tool_calls[0]["function"]["name"] if tool_calls else None
                                custom_msg = FUNCTION_CALL_MESSAGES.get(func_name, f"Calling function: {func_name}..." if func_name else default_function_call_message)
                                print(f"custom_msg: {custom_msg}")
                                yield {
                                    "step_type": "step",
                                    "message": custom_msg,
                                }
                    pass
        except Exception as e:
            tb_str = traceback.format_exc()
            print(f"ReactAgent.ainvoke error: {e}\n{tb_str}")
            yield {
                "step_type": "error",
                "message": ""
            }

def is_function_call(message: BaseMessage) -> bool:
    if isinstance(message, AIMessage):
        tool_calls = message.additional_kwargs.get("tool_calls", [])
        return len(tool_calls) > 0
    elif isinstance(message, ToolMessage):
        # ToolMessage implies a function has already been called and responded
        return True
    return False