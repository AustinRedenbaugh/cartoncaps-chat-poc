## IMPORTS ##
from langchain_core.tools import tool

## TOOLS ##
def get_react_agent_tools(user_id):
    @tool(
        "get_referral_link",
        description=f"Call this function to retrieve the referral link for the current user. The user_id is {user_id} (do not ask the user for it)."
    )
    async def get_referral_link() -> str:
        link = f"https://cartoncaps.com/route/to/link/{user_id}"
        return f"The referral link for this user is {link}. Always share this link as a hyperlink called 'Referral Link'."
    return [get_referral_link]