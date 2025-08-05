from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from ..db.sessions import get_db
from ..db.models import Users
import uuid
import os

router = APIRouter()

oauth = OAuth()
oauth.register(
    name='google',
    client_id = os.getenv("GOOGLE_CLIENT_ID"),
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url = "https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs = {"scope": "openid email profile"}
)

@router.get("/login")
async def google_login(request):
    redirect_uri = request.url_for("auth_google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/callback")
async def auth_google_callback(request, db = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = await oauth.google.parse_id_token(request, token)

    result = await db.execute(select(Users).where(Users.email == user_info["email"]))
    user = result.first()

    if user:
        return {200, "Welcome Back"}
    
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

    return {"message": "User registered!", "user": new_user.email}