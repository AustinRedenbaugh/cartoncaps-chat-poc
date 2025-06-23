from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from sse_starlette.sse import EventSourceResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
from datetime import datetime, timezone
from dotenv import load_dotenv
import json
import asyncio
load_dotenv()

from ..agents.react_agent import ReactAgentCore, ReactAgentSession
from .. import crud
from ..database import get_db

from langchain_openai import ChatOpenAI
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4o-mini",
)

from ..agents.tools import get_react_agent_tools

router = APIRouter()

class HelloRequest(BaseModel):
    user_id: int

class MessageRequest(BaseModel):
    user_id: int
    message: str
    conversation_id: int

@router.post("/hello")
async def hello(request: HelloRequest, db: Session = Depends(get_db)):
    user = crud.get_user_info(db, request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    hello_message = f"Hello {user.name}! How can I assist you today? If you have any questions about CartonCaps products or need help with referral links, feel free to ask!"

    # Calculate conversation_id
    conversation_id = crud.get_conversation_id(db, request.user_id)

    crud.add_conversation_message(
        db=db,
        user_id=request.user_id, 
        message=hello_message,
        sender="bot",
        timestamp=datetime.now(timezone.utc).isoformat(),
        conversation_id=conversation_id
    )
    return {"user": user, "message": hello_message, "conversation_id": conversation_id}

@router.get("/users")
async def get_users(db: Session = Depends(get_db)):
    users = crud.get_all_users(db)
    return {"users": [{"id": user.id, "school_id": user.school_id, "name": user.name, "email": user.email} for user in users]}

@router.post("/respond")
async def stream_response(request: MessageRequest, db: Session = Depends(get_db)):
    timestamp = datetime.now(timezone.utc).isoformat()
    crud.add_conversation_message(
        db=db,
        user_id=request.user_id, 
        message=request.message,
        sender="user",
        timestamp=timestamp,
        conversation_id=request.conversation_id
    )
    core = ReactAgentCore.get_instance(llm, request.user_id)
    session = ReactAgentSession(core, request.user_id, request.message, request.conversation_id, db)
    session.set_initial_state(request.user_id, request.message, request.conversation_id, db)
    async def event_generator():
        try:
            async for step in session.ainvoke():
                step_type = step.get("step_type")
                if step_type == "step":
                    yield {
                        "event": "step",
                        "data": json.dumps({
                            "type": "step",
                            "content": step,
                            "timestamp": datetime.now(timezone.utc).isoformat()
                        })
                    }
                elif step_type == "final_response":
                    yield {
                        "event": "final_response",
                        "data": json.dumps({
                            "type": "final_response",
                            "content": step,
                            "timestamp": datetime.now(timezone.utc).isoformat()
                        })
                    }
                    break
                elif step_type == "error":
                    yield {
                        "event": "error",
                        "data": json.dumps({
                            "type": "error",
                            "content": step,
                            "timestamp": datetime.now(timezone.utc).isoformat()
                        })
                    }
                    break
                await asyncio.sleep(0.1)
        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({
                    "type": "error",
                    "message": str(e),
                    "timestamp": datetime.now(timezone.utc).isoformat()
                })
            }
    return EventSourceResponse(event_generator())