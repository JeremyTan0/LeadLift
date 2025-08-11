from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from authlib.integrations.starlette_client import OAuth
from ..db.sessions import get_db
from ..db.models import Users
from ..utils.jwt import create_access_token, get_current_user
import uuid
import os

load_dotenv()

router = APIRouter()

oauth = OAuth()
oauth.register(
    name='google',
    client_id = os.getenv("GAUTH_CLIENT_ID"),
    client_secret = os.getenv("GAUTH_CLIENT_SECRET"),
    server_metadata_url = "https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs = {"scope": "openid email profile"}
)

@router.get("/login")
async def google_login(request: Request):
    redirect_uri = request.url_for("auth_google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/callback")
async def auth_google_callback(request: Request, db = Depends(get_db)):
    error = request.query_params.get("error")
    if error:
        if error == "access_denied":
            return RedirectResponse("http://localhost:3000/auth?error=cancelled")
        else:
            return RedirectResponse("http://localhost:3000/auth?error=oauth_failed")
        
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get("userinfo")
        if not user_info:
            return RedirectResponse("http://localhost:3000/auth?error=oauth_failed")

        result = await db.execute(select(Users).where(Users.email == user_info["email"]))
        user = result.scalar_one_or_none()

        if not user:    
            new_user = Users(
                id=str(uuid.uuid4()),
                name=user_info["name"],
                email=user_info["email"],
                saved_places=[],
                is_admin=False
            )

            db.add(new_user)
            await db.commit()
            await db.refresh(new_user)

            user = new_user
        
        access_token = create_access_token(data={"sub": user.id})

        response = RedirectResponse(url="http://localhost:3000/search")
        
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="Lax", max_age=60 * 60)
        return response
    except:
        return RedirectResponse("http://localhost:3000/auth?error=server_error")


@router.get("/me")
async def get_me(request: Request, current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "is_admin": current_user.is_admin,
        "saved_places": current_user.saved_places
    }


@router.post("/logout")
async def logout():
    response = RedirectResponse(url="http://localhost:3000/", status_code=302)
    response.set_cookie(key="access_token", value="", httponly=True, secure=False, samesite="Lax", max_age=0)
    return response