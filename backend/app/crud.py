from sqlalchemy.orm import Session
from . import models

def get_user_info(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_all_users(db: Session):
    return db.query(models.User).all()

def add_conversation_message(db: Session, user_id: int, message: str, sender: str, timestamp: str):
    conversation_message = models.ConversationHistory(
        user_id=user_id,
        message=message,
        sender=sender,
        timestamp=timestamp
    )
    db.add(conversation_message)
    db.commit()
    db.refresh(conversation_message)
    return conversation_message 