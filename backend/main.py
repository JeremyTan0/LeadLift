import dotenv
from fastapi import FastAPI
from fastapi import Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

from business_mapper import search_businesses, get_business_details
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    business = get_business_details(place_id)
    if not business:
        return 404, "Business not found"

    return business
