from sqlalchemy.orm import Session
from . import models

def get_user_info(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_all_users(db: Session):
    return db.query(models.User).all()

def add_conversation_message(db: Session, user_id: int, message: str, sender: str, timestamp: str, conversation_id: int = None):
    conversation_message = models.ConversationHistory(
        user_id=user_id,
        message=message,
        sender=sender,
        timestamp=timestamp,
        conversation_id=conversation_id
    )
    db.add(conversation_message)
    db.commit()
    db.refresh(conversation_message)
    return conversation_message

def get_conversation_id(db: Session, user_id: int):
    # Get the largest conversation_id in the Conversation_History table
    max_id = db.query(models.ConversationHistory.conversation_id).order_by(models.ConversationHistory.conversation_id.desc()).first()
    if max_id and max_id[0] is not None:
        return max_id[0] + 1
    else:
        return 1

def get_conversation_messages(db: Session, conversation_id: int):
    """Return all messages for a conversation, ordered by timestamp ascending."""
    return db.query(models.ConversationHistory).filter(models.ConversationHistory.conversation_id == conversation_id).order_by(models.ConversationHistory.timestamp.asc()).all() 