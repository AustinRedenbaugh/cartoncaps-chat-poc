## IMPORTS ##
from langchain_core.tools import tool

from pydantic import BaseModel
import os


## TOOLS ##
class ReferralInput(BaseModel):
    user_id: int

@tool("get_referral_link", args_schema=ReferralInput)
async def get_referral_link(user_id: int) -> str:
    """Call this function to retrieve the referral link associated with this user"""
    return "https://cartoncaps.com/route/to/link"

def get_react_agent_tools():
    return [get_referral_link]