from dotenv import load_dotenv
import json
import requests
import os
from functools import lru_cache

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is missing in .env file")



@lru_cache(maxsize=100)
def search_businesses(query: str, next_page_token:str = None):

    print(f"Looking up query: {query}")

    search_params = {
        "textQuery": query,
        "pageSize": 10
    }

    if next_page_token:
        search_params["pageToken"] = next_page_token

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask":
            "places.displayName,"
            "places.formattedAddress,"
            "places.id,"
            "places.rating,"
            "places.userRatingCount,"
            "nextPageToken"
    }
    try:
        response = requests.post(
            "https://places.googleapis.com/v1/places:searchText",
            json=search_params,
            headers=headers
        )


        return response.json()

    except requests.RequestException as e:
        print(f"Error searching businesses: {e}")
        return []


@lru_cache(maxsize=50)
def get_business_details(place_id: str):
    print(f"Looking up business ID: {place_id}")

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask":
            "displayName,"
            "formattedAddress,"
            "rating,"
            "userRatingCount,"
            "websiteUri,"
            "nationalPhoneNumber,"
            "internationalPhoneNumber,"
            "reviewSummary,"
            "editorialSummary,"
            "businessStatus,"
            "photos,"
            "reviews"
    }


    try:
        response = requests.get(
            f"https://places.googleapis.com/v1/places/{place_id}",
            headers=headers
        )
        response.raise_for_status()
        raw_data = response.json()

        cleaned_data = {
            "name": raw_data.get("displayName", {}).get("text", None),
            "status": raw_data.get("businessStatus", None),
            "address": raw_data.get("formattedAddress", None),
            "localPhone": raw_data.get("nationalPhoneNumber", None),
            "internationalPhone": raw_data.get("internationalPhoneNumber", None),
            "website": raw_data.get("websiteUri", None),
            "rating": raw_data.get("rating", None),
            "totalReviews": raw_data.get("userRatingCount", None),
            "summary": raw_data.get("editorialSummary", {}).get("text", None),
            "reviewSummary": raw_data.get("reviewSummary", {}).get("text", {}).get("text", None),
            "reviews": [],
            "photos": []
        }
        
        for review in raw_data.get("reviews", []):
            cleaned_data["reviews"].append({
                "author": review.get("authorAttribution", None).get("displayName", None),
                "rating": review.get("rating", None),
                "time": review.get("relativePublishTimeDescription", None),
                "text": review.get("text", None).get("text", None),
            })

        for photo in raw_data.get("photos", []):
            for author in photo.get("authorAttributions", []):
                cleaned_data["photos"].append({
                    "photoUri": photo.get("googleMapsUri", None),
                    "width": photo.get("widthPx", None),
                    "height": photo.get("heightPx", None)
                })
        return cleaned_data

    except requests.RequestException as e:
        print(f"Error getting business details: {e}")
        return None
