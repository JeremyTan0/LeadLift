import dotenv
from fastapi import Depends, HTTPException, Request
from sqlalchemy import select
from datetime import datetime, timedelta, timezone
from jose import jwt
import os

from ..db.sessions import get_db
from ..db.models import Users

dotenv.load_dotenv()
SECRET_KEY = os.getenv("JWT_SECRET_KEY")

ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, "HS256")


async def get_current_user(request: Request, db = Depends(get_db)):
    token = request.cookies.get("access_token")
    print(request.cookies)
    print(token)
    if token is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, "HS256")
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    result = await(db.execute(select(Users).where(Users.id == user_id)))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

