from sqlalchemy.orm import Session
from . import models

def get_user_info(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_all_users(db: Session):
    return db.query(models.User).all() 