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
load_dotenv()
import traceback

## REACT AGENT IN LANGCHAIN ##
class ReactAgentState(TypedDict):
    messages: Annotated[list, add_messages]
    current_node: str

class ReactAgent:
    def __init__(self, llm_with_tools, user_id, user_message):
        self.llm_with_tools = llm_with_tools
        self.user_id = user_id
        self.user_message = user_message
        self.graph = StateGraph(ReactAgentState)
        self._setup_graph()

    def get_initial_messages(self, user_id):
        # Return just the list of messages
        return [{"role": "user", "content": self.user_message}]

    async def call_model(self, state):
        """Call the LLM with tools, return updated state with new message."""
        messages = state["messages"]
        print(f"[ReactAgent call_model] Current messages: {messages}")
        # Call the LLM with the current messages
        response = await self.llm_with_tools.ainvoke(messages)
        # Add the assistant's response to messages
        new_messages = messages + [response]
        print(f"[ReactAgent call_model] Updated messages after agent: {new_messages}")
        return {"messages": new_messages, "current_node": "call_model"}

    async def call_tool(self, state):
        """Invoke the tool and add its response to messages."""
        messages = state["messages"]
        print(f"[ReactAgent call_tool] Current messages: {messages}")
        last_message = messages[-1] if messages else {}
        tool_call = last_message.get("tool_call")
        tool_response = ""
        if tool_call:
            # Simulate tool invocation (replace with actual tool logic)
            # For example, if tool_call['name'] == 'supply_referral_link', call the tool
            # Here, just return a string for demonstration
            tool_response = f"Tool {tool_call['name']} invoked with args {tool_call.get('args', {})}"
        # Add the tool response as an assistant message
        new_messages = messages + [{"role": "assistant", "content": tool_response}]
        print(f"[ReactAgent call_tool] Updated messages after action: {new_messages}")
        return {"messages": new_messages, "current_node": "call_tool"}

    def should_continue(self, state):
        messages = state["messages"]
        if not messages:
            return "end"
        last_message = messages[-1]

        if isinstance(last_message, AIMessage) and getattr(last_message, "tool_call", None):
            print("[ReactAgent should_continue] : action (tool_call detected)")
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
                print(f"current_node: {current_node}")

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
