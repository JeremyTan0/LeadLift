from bs4 import BeautifulSoup
from dotenv import load_dotenv
from crawlbase import CrawlingAPI
import os

load_dotenv()
CRAWLBASE_NAPI_KEY = os.getenv("CRAWLBASE_NAPI_KEY")
CRAWLBASE_JSAPI_KEY = os.getenv("CRAWLBASE_JSAPI_KEY")


def audit_title_tag(soup):
    title_tag = soup.find('title')
    if not title_tag:
        return {
            'status': 'missing',
            'title': None,
            'length': 0,
            'score': 0
        }

    title_text = title_tag.get_text().strip()
    title_length = len(title_text)

    if 50 <= title_length <= 60:
        status = 'optimal'
        score = 10
    elif title_length < 50:
        status = 'short'
        score = 7
    else:
        status = 'long'
        score = 7

    return {
        'status': status,
        'title': title_text,
        'length': title_length,
        'score': score
    }

def audit_meta_description(soup):
    meta_desc = soup.find('meta', attrs={'name': 'description'})

    if not meta_desc:
        return {
            'status': 'missing',
            'description': None,
            'length': 0,
            'score': 0
        }

    desc_content = meta_desc.get('content', '').strip()
    desc_length = len(desc_content)

    if 150 <= desc_length <= 160:
        status = 'optimal'
        score = 10
    elif desc_length < 150:
        status = 'short'
        score = 7
    else:
        status = 'long'
        score = 6

    return {
        'status': status,
        'description': desc_content,
        'length': desc_length,
        'score': score
    }

def audit_language_attribute(soup):
    html_tag = soup.find('html')

    if html_tag and html_tag.get('lang'):
        return {
            'status': 'present',
            'lang': html_tag.get('lang'),
            'score': 10
        }
    else:
        return {
            'status': 'missing',
            'lang': None,
            'score': 5
        }

def audit_header_tags(soup):
    h1_tags = soup.find_all('h1')
    h2_to_h6_tags = soup.find_all(['h2', 'h3', 'h4', 'h5', 'h6'])

    h1_status = 'missing' if len(h1_tags) == 0 else 'multiple' if len(h1_tags) > 1 else 'optimal'

    h1_result = {
        'status': h1_status,
        'count': len(h1_tags),
        'score': 10 if h1_status == 'optimal' else 5 if h1_status == 'multiple' else 0
    }

    h2_h6_result = {
        'status': 'present' if len(h2_to_h6_tags) > 0 else 'missing',
        'count': len(h2_to_h6_tags),
        'score': 10 if len(h2_to_h6_tags) > 0 else 5
    }

    return {
        'h1': h1_result,
        'h2_h6': h2_h6_result
    }

def audit_content_amount(soup):
    for script in soup(["script", "style"]):
        script.decompose()

    text = soup.get_text()
    words = len(text.split())

    if words >= 500:
        status = 'good'
        score = 10
    elif words >= 300:
        status = 'moderate'
        score = 7
    else:
        status = 'low'
        score = 3

    return {
        'status': status,
        'word_count': words,
        'score': score
    }

def audit_images(soup):
    images = soup.find_all('img')
    total_images = len(images)

    if total_images == 0:
        return {
            'status': 'no_images',
            'total_images': 0,
            'missing_alt': 0,
            'score': 10
        }

    missing_alt = len([img for img in images if not img.get('alt')])

    if missing_alt == 0:
        status = 'optimal'
        score = 10
    else:
        status = 'missing_alt'
        score = 10 - ((missing_alt / total_images) * 10)

    return {
        'status': status,
        'total_images': total_images,
        'missing_alt': missing_alt,
        'score': score
    }

def calculate_score(results):
    total_score = 0
    max_score = 0
    percentage = 0

    scoring_sections = [
        'title_tag', 'meta_description', 'language', 'content_amount',
        'images']
    for section in scoring_sections:
        if section in results and 'score' in results[section]:
            total_score += results[section]['score']
            max_score += 10

    if 'headers' in results:
        total_score += results['headers']['h1']['score']
        total_score += results['headers']['h2_h6']['score']
        max_score += 20

    if max_score > 0:
        percentage = (total_score / max_score * 100)

    return {
        'score': total_score,
        'max_score': max_score,
        'percentage': round(percentage, 1)
    }

def website_audit(url):
    api = CrawlingAPI({ 'token': CRAWLBASE_JSAPI_KEY })
    response = api.get(url, options = {})
    if response['status_code'] == 200:
        html = response['body']
        soup = BeautifulSoup(html, 'html.parser')
        results = {
            'url': url,
            'title_tag': audit_title_tag(soup),
            'meta_description': audit_meta_description(soup),
            'language': audit_language_attribute(soup),
            'headers': audit_header_tags(soup),
            'content_amount': audit_content_amount(soup),
            'images': audit_images(soup),
        }
        results['score'] = calculate_score(results)
        return results

# print(website_audit("starwars.com"))