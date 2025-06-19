## IMPORTS ##
# AI Libraries
from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
from langchain_core.messages import AIMessage
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
        self._setup_graph()

    def get_initial_messages(self, user_id):
        # Return just the list of messages
        return [{"role": "user", "content": self.user_message}]

    async def call_model(self, state):
        messages = state["messages"]
        # Call the LLM with the current messages
        response = await self.llm_with_tools.ainvoke(messages)
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
        print(f"[ReactAgent call_model] new_messages: {new_messages}")
        return {"messages": new_messages, "current_node": "call_model"}

    async def call_tool(self, state):
        messages = state["messages"]
        last_message = messages[-1] if messages else {}
        print(f"≈ last_message: {last_message}")
        tool_calls = getattr(last_message, "additional_kwargs", {}).get("tool_calls", None)

        if tool_calls and len(tool_calls) > 0:
            tool_call = tool_calls[0]
            tool_name = tool_call["function"]["name"]
            tool_args_str = tool_call["function"]["arguments"]
            tool_call_id = tool_call.get("id")
            print(f"[ReactAgent call_tool] tool_name: {tool_name}")
            print(f"[ReactAgent call_tool] tool_args_str: {tool_args_str}")
            tools = get_react_agent_tools()
            tool_map = {t.name: t for t in tools}
            tool_func = tool_map.get(tool_name)
            if tool_func:
                try:
                    tool_args = json.loads(tool_args_str)
                    print(f"[ReactAgent call_tool] tool_args: {tool_args}")
                    if hasattr(tool_func, "ainvoke"):
                        tool_response = await tool_func.ainvoke(tool_args)
                    elif inspect.iscoroutinefunction(tool_func):
                        tool_response = await tool_func(tool_args)
                    else:
                        tool_response = tool_func(tool_args)
                except Exception as e:
                    tool_response = f"[Tool error: {e}]"
            else:
                tool_response = f"[Tool '{tool_name}' not found]"

            # Add the tool response as a tool message with tool_call_id
            new_messages = messages + [{
                "role": "tool",
                "content": tool_response,
                "tool_call_id": tool_call_id
            }]
        else:
            # Fallback: if no tool call, just echo previous messages
            new_messages = messages
        print(f"[ReactAgent call_tool] tool_response: {tool_response}")
        
        # Add to Conversation_History if db is available
        if self.db:
            timestamp = datetime.now(timezone.utc).isoformat()
            crud.add_conversation_message(
                db=self.db,
                user_id=self.user_id,
                message=tool_response,
                sender="bot",
                timestamp=timestamp
            )
        print(f"[ReactAgent call_tool] new_messages: {new_messages}")
        return {"messages": new_messages, "current_node": "call_tool"}

    def should_continue(self, state):
        messages = state["messages"]
        if not messages:
            return "end"
        last_message = messages[-1]
        print(f"[ReactAgent should_continue] last_message: {last_message}")
        # Check for function calls in additional_kwargs
        tool_calls = getattr(last_message, "additional_kwargs", {}).get("tool_calls", None)
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
                # print(f"step: {step}")
                messages = step["messages"]
                current_node = step["current_node"]
                # print(f"current_node: {current_node}")

                # If this is the final step, yield a final response and break
                if current_node == "__end__":
                    if messages:
                        last_message = messages[-1]
                        if last_message.get("role") == "assistant":
                            yield {
                                "step_type": "final_response",
                                "message": messages[-1],
                            }
                    break
                
                if current_node == "__start__":
                    continue

                # Otherwise, yield new message
                yield {
                    "step_type": "step",
                    "message": messages[-1].content,
                }
        except Exception as e:
            tb_str = traceback.format_exc()
            print(f"ReactAgent.ainvoke error: {e}\n{tb_str}")
            yield {
                "step_type": "error",
                "message": ""
            }
