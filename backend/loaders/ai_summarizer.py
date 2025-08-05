from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel
import json
import os

load_dotenv()
AI_API_KEY = os.getenv("AI_API_KEY")

client = genai.Client(api_key=AI_API_KEY)
MODEL="gemini-2.5-flash"

class AISummary(BaseModel):
    business_summary: str
    online_presence_review: str
    online_presence_score: int
    red_flags: list[list[str]]
    overall_score: float
    facebook_followers: list[list[str]]
    instagram_followers: list[list[str]]

def gen_ai_summary(business):
    filtered_business = {k: v for k, v in business.items() if k not in ['photos', 'reviews', 'totalReviews']}
    business_str = json.dumps(filtered_business)
    response = client.models.generate_content(
        model=MODEL,
        contents=f'You are a top-tier, award winning digital marketing agent. With the following information '
                 f'and additional information you find online about the business provided, provide the following information in the perspective of a helpful assistant:'
                 f'A brief overview of the business in your perspective, a review on the business\'s online presence (such as social media, internet, etc) and accessibility online,'
                 f'and potential red flags related to their business growth, marketing, SEO, etc. Each red flag should be a tuple (title, explanation), where the title is a short phrase, and the explanation provides specific marketing, SEO, or growth-related concern.'
                 f'Also, based on everything you gathered, give an overall score out of 100 based on their need for SEO solutions. And scrape and find the business related facebook or instagram account and details, in tuple format (handle, follower count). If none found for X platform, put None'
                 f'The business in particular is:'
                 f'{business_str}',
        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=AISummary
        )
    )

    if not response:
        raise ValueError("API returned empty response")

    if not hasattr(response, 'parsed') or response.parsed is None:
        raise ValueError("API response missing parsed content")

    parsed_output: AISummary = response.parsed

    final_output = {
        "business_summary": parsed_output.business_summary,
        "online_presence_review": parsed_output.online_presence_review,
        "online_presence_score": parsed_output.online_presence_score,
        "red_flags": parsed_output.red_flags,
        "overall_score": parsed_output.overall_score,
        "fb_followers": parsed_output.facebook_followers,
        "ig_followers": parsed_output.instagram_followers
    }
    return final_output