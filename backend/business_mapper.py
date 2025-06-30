from dotenv import load_dotenv
import os

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def get_businesses(query: str, location: str):
    if not GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY is missing in .env file")
    print(query, location)
