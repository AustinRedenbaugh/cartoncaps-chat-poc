## IMPORTS ##
from langchain_core.tools import tool
from .sql_agent import SQLAgentCore, SQLAgentSession
from .prompts import get_system_prompt
from ..database import SessionLocal, Base, engine

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


def get_schema_description():
    lines = ["Tables:"]
    metadata = Base.metadata
    metadata.reflect(bind=engine)
    for table_name, table in metadata.tables.items():
        columns = ", ".join([col.name for col in table.columns])
        lines.append(f"- {table_name}({columns})")
    return "\n".join(lines)

def get_sql_agent_tools(llm, user_id):
    @tool(
        "use_sql_agent",
        description="Call this function to answer questions about Products in the inventory or about the Purchase_History of the user. Pass the user's question as the 'query' argument."
    )
    async def use_sql_agent(query: str) -> str:
        # Dynamically build schema description from SQLAlchemy models in the future
        prompt = get_system_prompt('SQLAgent')
        # Patch the system prompt for this run
        def patched_get_system_prompt(agent_name):
            if agent_name == 'SQLAgent':
                return prompt
            return get_system_prompt(agent_name)
        # Create agent and session
        agent_core = SQLAgentCore.get_instance(llm, user_id)
        session = SQLAgentSession(agent_core, user_id, query, conversation_id=None, db=SessionLocal())
        # Patch the prompt function
        session.get_initial_messages = lambda: [
            {"role": "system", "content": prompt},
            {"role": "user", "content": query}
        ]
        # Run the agent and collect the final response
        async for step in session.ainvoke():
            print(f"[use_sql_agent] step: {step}")
            if step["step_type"] == "final_response":
                return step["message"]
        return "No response from SQL agent."
    return [use_sql_agent]