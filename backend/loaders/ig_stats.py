import requests
from bs4 import BeautifulSoup

def get_ig_metrics(username):
    url = f"https://hypeauditor.com/instagram/{username}/"
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://google.com"
    }

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    followers = None
    avg_likes = None
    avg_comments = None
    for block in soup.select(".metric"):
        title = block.select_one(".metric__title")
        if title and "followers" in title.get_text(strip=True).lower():
            content = block.select_one(".metric__content")
            followers = content.get_text(strip=True) if content else None
        elif title and "likes" in title.get_text(strip=True).lower():
            content = block.select_one(".metric__content")
            avg_likes = content.get_text(strip=True) if content else None
        elif title and "comments" in title.get_text(strip=True).lower():
            content = block.select_one(".metric__content")
            avg_comments = content.get_text(strip=True) if content else None
        if followers and avg_likes and avg_comments:
            break


    metrics = soup.select("span.metric-card__value")
    engagement = metrics[0].get_text(strip=True) if len(metrics) > 0 else None
    growth = metrics[1].get_text(strip=True) if len(metrics) > 1 else None

    return {
        "username": username,
        "followers": followers,
        "avg_likes": avg_likes,
        "avg_comments": avg_comments,
        "engagement_rate": engagement,
        "growth_rate": growth
    }