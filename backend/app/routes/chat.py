from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from .. import crud
from ..database import get_db

router = APIRouter()

class MessageRequest(BaseModel):
    conversation_id: int
    message: str

@router.get("/hello")
async def hello(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user_info(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": user, "message": f"Hello {user.name}!"}

@router.get("/users")
async def get_users(db: Session = Depends(get_db)):
    users = crud.get_all_users(db)
    return {"users": [{"id": user.id, "school_id": user.school_id, "name": user.name, "email": user.email} for user in users]}

@router.post("/respond")
async def respond(request: MessageRequest, db: Session = Depends(get_db)):
    # Basic response for now
    return {"message": f"Received your message: {request.message}"} 