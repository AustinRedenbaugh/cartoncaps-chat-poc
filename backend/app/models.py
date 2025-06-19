from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from .database import Base

class School(Base):
    __tablename__ = "Schools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String)
    created_at = Column(String, nullable=False)

    users = relationship("User", back_populates="school")


class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey("Schools.id"))
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    created_at = Column(String, nullable=False)

    school = relationship("School", back_populates="users")
    purchases = relationship("PurchaseHistory", back_populates="user")
    conversations = relationship("ConversationHistory", back_populates="user")


class Product(Base):
    __tablename__ = "Products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    created_at = Column(String, nullable=False)

    purchases = relationship("PurchaseHistory", back_populates="product")


class PurchaseHistory(Base):
    __tablename__ = "Purchase_History"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("Products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    purchased_at = Column(String, nullable=False)

    user = relationship("User", back_populates="purchases")
    product = relationship("Product", back_populates="purchases")


class ConversationHistory(Base):
    __tablename__ = "Conversation_History"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    message = Column(Text, nullable=False)
    sender = Column(String, nullable=True)
    timestamp = Column(String, nullable=False)
    conversation_id = Column(Integer, nullable=True)

    __table_args__ = (
        CheckConstraint("sender IN ('user', 'bot', 'tool')"),
    )

    user = relationship("User", back_populates="conversations")
