from dotenv import load_dotenv
import hashlib
import json
import redis
import requests
import os
from loaders.website_audit import website_audit
from loaders.gtrend_finder import get_search_trends
from urllib.parse import urlparse


load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
r = redis.from_url(REDIS_URL, decode_responses=True)


if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is missing in .env file")

def redis_cache(duration=172800):
    def decorator(func):
        def wrapper(*args, **kwargs):
            key_base = {
                "func": func.__name__,
                "args": args,
                "kwargs": kwargs
            }

            key_str = json.dumps(key_base, sort_keys=True, default=str)
            key_hash = hashlib.md5(key_str.encode()).hexdigest()
            redis_key = f"cache:{func.__name__}:{key_hash}"

            cached = r.get(redis_key)
            if cached:
                return json.loads(cached)

            result = func(*args, **kwargs)
            r.setex(redis_key, duration, json.dumps(result))
            return result
        return wrapper
    return decorator


@redis_cache(duration=172800)
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


@redis_cache(duration=604800)
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
                
        cleaned_data["gtrends"] = get_search_trends(cleaned_data["name"])

        parsed_url = urlparse(cleaned_data["website"])
        cleaned_data["website_audit"] = website_audit(f"{parsed_url.netloc}")
        return cleaned_data

    except requests.RequestException as e:
        print(f"Error getting business details: {e}")
        return None


