from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages

from typing import Annotated, Literal
from typing_extensions import TypedDict
from dotenv import load_dotenv
load_dotenv()

class ReactAgentState(TypedDict):
    messages: Annotated[list, add_messages]

graph = StateGraph(ReactAgentState)