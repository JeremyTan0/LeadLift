from sqlalchemy import Column, Integer, Text, DateTime, Boolean, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.types import JSON
from datetime import datetime, timezone

Base = declarative_base()

class Users(Base):
    __tablename__ = "users"

    id = Column(Text, primary_key=True)
    name = Column(Text, nullable=False)
    email = Column(Text, unique=True, nullable=False)
    saved_places = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    is_admin = Column(Boolean, default=False)

