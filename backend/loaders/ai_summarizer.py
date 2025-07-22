from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel
import json
import os

load_dotenv()
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=GOOGLE_API_KEY)
MODEL="gemini-2.5-pro"

class AISummary(BaseModel):
    business_summary: str
    online_presence_review: str
    online_presence_score: int
    red_flags: list[list[str]]

def gen_ai_summary(business):
    filtered_business = {k: v for k, v in business.items() if k not in ['photos', 'reviews', 'totalReviews']}
    business_str = json.dumps(filtered_business)
    response = client.models.generate_content(
        model=MODEL,
        contents=f'You are a top-tier, award winning digital marketing agent. With the following information '
                 f'and additional information you find online about the business provided, provide the following information in the perspective of a helpful assistant:'
                 f'A brief overview of the business in your perspective, a review on the business\'s online presence (such as social media, internet, etc) and accessibility online,'
                 f'and potential red flags related to their business growth, marketing, SEO, etc. Each red flag should be a tuple (title, explanation), where the title is a short phrase, and the explanation provides specific marketing, SEO, or growth-related concern.'
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
    return parsed_output