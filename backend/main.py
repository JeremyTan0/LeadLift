import dotenv
from fastapi import FastAPI, Depends, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .auth import google
import os

from .utils.jwt import get_current_user, get_db

from .business_mapper import (search_businesses, get_business_details,
                             get_website_stats, get_gtrends, ai_summary, get_score)

app = FastAPI()
app.include_router(google.router, prefix="/auth")

app.add_middleware(
    SessionMiddleware,
    secret_key="aiwyvdhbauowbduweouhewy7t3982u4ih1rg239fwe7280",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dotenv.load_dotenv()

@app.get("/")
def root():
    return {"Hello": "World"}


@app.get("/businesses")
def get_businesses(query: str = Query(...), page_token: str = Query(None), current_user = Depends(get_current_user)):
    result = search_businesses(query=query, next_page_token=page_token)
    for business in result['places']:
        if 'displayName' in business and 'text' in business['displayName']:
            business['displayName'] = business['displayName']['text']
    output = {
        "businesses": result['places'],
        "count": len(result['places']),
        "nextPageToken": None,
        "hasMore": False
    }
    nextPageToken = result.get("nextPageToken", None)
    if nextPageToken:
        output["nextPageToken"] = nextPageToken
        output["hasMore"] = True

    return output


@app.get("/businesses/{place_id}")
def get_business_info(place_id: str, current_user = Depends(get_current_user)):
    business = get_business_details(place_id=place_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not Found")
    return business


@app.get("/businesses/score/{place_id}")
def get_business_score(place_id: str, current_user = Depends(get_current_user)):
    score = get_score(place_id=place_id)
    print(f"FINAL SCORE: {score}")
    if not score:
        raise HTTPException(status_code=404, detail="No score calculated")
    return score


@app.get("/businesses/web-analytics/{place_id}")
def get_web_analytics(place_id: str, current_user = Depends(get_current_user)):
    stats = get_website_stats(place_id=place_id)
    if not stats:
        raise HTTPException(status_code=404, detail="No Website Analytics Found")
    return stats


@app.get("/businesses/trends/{name}")
def get_trends(name: str, current_user = Depends(get_current_user)):
    stats = get_gtrends(name=name)
    if not stats:
        raise HTTPException(status_code=404, detail="Trends not Found")
    return stats["gtrends"]


@app.get("/businesses/summary/{place_id}")
def get_summary(place_id: str, current_user = Depends(get_current_user)):
    summary = ai_summary(place_id=place_id)
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not Found")
    return summary


@app.post("/saved-places/{place_id}")
async def save_place(place_id: str, db = Depends(get_db), current_user = Depends(get_current_user)):
    saved_places = current_user.saved_places or []
    if place_id in saved_places:
        raise HTTPException(status_code=400, detail="Place already saved")
    
    saved_places.append(place_id)

    current_user.saved_places = saved_places
    await db.commit()
    return 400