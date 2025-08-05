import dotenv
from fastapi import FastAPI
from fastapi import Query
from backend.auth import google
import os

from business_mapper import (search_businesses, get_business_details,
                             get_website_stats, get_gtrends, ai_summary, get_score)

app = FastAPI()
app.include_router(google.router, prefix="/auth")

dotenv.load_dotenv()

@app.get("/")
def root():
    return {"Hello": "World"}


@app.get("/businesses")
def get_businesses(query: str = Query(...), page_token: str = Query(None)):
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
def get_business_info(place_id: str):
    business = get_business_details(place_id=place_id)
    if not business:
        return 404, "Business not found"
    return business


@app.get("/businesses/score/{place_id}")
def get_business_score(place_id: str):
    score = get_score(place_id=place_id)
    if not score:
        return 404, "No score calculated"
    return score


@app.get("/businesses/web-analytics/{place_id}")
def get_web_analytics(place_id: str):
    stats = get_website_stats(place_id=place_id)
    if not stats:
        return 404, "Stats not found"
    return stats


@app.get("/businesses/trends/{name}")
def get_trends(name: str,):
    stats = get_gtrends(name=name)
    if not stats:
        return 404, "Trends not found"
    return stats["gtrends"]


@app.get("/businesses/summary/{place_id}")
def get_summary(place_id: str):
    summary = ai_summary(place_id=place_id)
    if not summary:
        return 404, "Summary not created"
    return summary

@app.get("/login")
def login(jauth):
    return jauth

@app.get("/register")
def register():
    return "register"