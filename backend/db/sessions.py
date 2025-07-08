from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

engine = create_engine("sqlite:///leadlift.db", echo=True)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
