from dotenv import load_dotenv
import hashlib
import json
import redis
import requests
import os
from loaders.website_audit import website_audit
from loaders.gtrend_finder import get_search_trends
from loaders.ai_summarizer import gen_ai_summary
from urllib.parse import urlparse
from google import genai
from google.genai import types

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
r = redis.from_url(REDIS_URL, decode_responses=True)


if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is missing in .env file")


def redis_cache(duration=172800):
    def decorator(func):
        def wrapper(*args, **kwargs):
            func_name = func.__name__

            if func_name == "get_business_details" and "place_id" in kwargs:
                redis_key = f"cache:{func_name}:{kwargs['place_id']}"

            elif func_name == "get_business_stats":
                name = kwargs.get("name") or (args[0] if len(args) > 0 else "unknown")
                website = kwargs.get("website") or (args[1] if len(args) > 1 else "")
                name = name.replace(" ", "_")
                try:
                    parsed = urlparse(website)
                    domain = parsed.netloc.lower() if parsed.netloc else "no-site"
                except Exception:
                    domain = "invalid-site"
                redis_key = f"cache:{func_name}:{name}:{domain}"

            elif func_name == "search_businesses":
                query = kwargs.get("query") or (args[0] if len(args) > 0 else "")
                token = kwargs.get("next_page_token") or (args[1] if len(args) > 1 else "")
                query = query.lower()
                base = json.dumps({"q": query, "token": token}, sort_keys=True)
                key_hash = hashlib.md5(base.encode()).hexdigest()
                redis_key = f"cache:{func_name}:{key_hash}"

            elif func_name == "get_website_stats":
                redis_key = f"cache:{func_name}:{kwargs['place_id']}"

            elif func_name == "get_gtrends":
                name = kwargs.get("name") or (args[0] if len(args) > 0 else "unknown")
                name = name.replace(" ", "_")
                redis_key = f"cache:{func_name}:{name}"

            elif func_name == "ai_summary" and "place_id" in kwargs:
                redis_key = f"cache:{func_name}:{kwargs['place_id']}"

            else:
                return func(*args, **kwargs)

            cached = r.get(redis_key)
            if cached:
                print(f"CACHED! {cached[:50]}")
                return json.loads(cached)

            result = func(*args, **kwargs)
            r.setex(redis_key, duration, json.dumps(result))
            return result

        return wrapper

    return decorator


@redis_cache(duration=172800)
def search_businesses(query: str, next_page_token:str = None):
    print(f"Looking up query: {query}")
    query = query.lower()

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
            "id,"
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
            "id": raw_data.get("id", None),
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


@redis_cache(duration=604800)
def get_website_stats(place_id: str):
    business = get_business_details(place_id=place_id)
    website = business["website"]
    output = {}
    try:
        parsed_url = urlparse(website)
        output = website_audit(f"{parsed_url.netloc}")
    except:
        output = {"url": None}
    return output


@redis_cache(duration=604800)
def get_gtrends(name: str):
    return {"gtrends": get_search_trends(name)}


@redis_cache(duration=604800)
def ai_summary(place_id: str):
    business = get_business_details(place_id=place_id)
    return gen_ai_summary(business=business)


WEIGHTS = {
    "website": 0.4,
    "gemini": 0.6,
}

@redis_cache(duration=604800)
def get_score(place_id: str):
    ai_calculation = ai_summary(place_id=place_id)["overall_score"]
    website_score = get_website_stats(place_id=place_id)["score"]["percentage"]

    final_score = (website_score * WEIGHTS["website"]) + (float(ai_calculation) * WEIGHTS["website"])
    return round(final_score, 1)