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
            'status': 'Title tag is missing - Add a title tag to improve SEO',
            'title': None,
            'length': 0,
            'score': 0
        }

    title_text = title_tag.get_text().strip()
    title_length = len(title_text)

    if 50 <= title_length <= 60:
        status = 'Title length is optimal for search engines'
        score = 10
    elif title_length < 50:
        status = f'Title is too short ({title_length} chars) - Consider expanding to 50-60 characters'
        score = 7
    else:
        status = f'Title is too long ({title_length} chars) - Consider shortening to 50-60 characters'
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
            'status': 'Meta description is missing - Add a description to improve search result snippets',
            'description': None,
            'length': 0,
            'score': 0
        }

    desc_content = meta_desc.get('content', '').strip()
    desc_length = len(desc_content)

    if 150 <= desc_length <= 160:
        status = 'Meta description length is optimal for search engines'
        score = 10
    elif desc_length < 150:
        status = f'Meta description is too short ({desc_length} chars) - Consider expanding to 150-160 characters'
        score = 7
    else:
        status = f'Meta description is too long ({desc_length} chars) - May be truncated in search results'
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
            'status': f'Language attribute is properly set to "{html_tag.get("lang")}"',
            'lang': html_tag.get('lang'),
            'score': 10
        }
    else:
        return {
            'status': 'HTML lang attribute is missing - Add lang attribute to improve accessibility',
            'lang': None,
            'score': 5
        }


def audit_header_tags(soup):
    h1_tags = soup.find_all('h1')
    h2_to_h6_tags = soup.find_all(['h2', 'h3', 'h4', 'h5', 'h6'])

    if len(h1_tags) == 0:
        h1_status = 'No H1 tag found - Add one H1 tag for better content structure'
        h1_score = 0
    elif len(h1_tags) > 1:
        h1_status = f'Multiple H1 tags found ({len(h1_tags)}) - Use only one H1 per page'
        h1_score = 5
    else:
        h1_status = 'Single H1 tag found - Perfect for content hierarchy'
        h1_score = 10

    h1_result = {
        'status': h1_status,
        'count': len(h1_tags),
        'score': h1_score
    }

    if len(h2_to_h6_tags) > 0:
        h2_h6_status = f'Good content structure with {len(h2_to_h6_tags)} subheading(s) (H2-H6)'
        h2_h6_score = 10
    else:
        h2_h6_status = 'No subheadings (H2-H6) found - Consider adding subheadings for better structure'
        h2_h6_score = 5

    h2_h6_result = {
        'status': h2_h6_status,
        'count': len(h2_to_h6_tags),
        'score': h2_h6_score
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
        status = f'Excellent content amount with {words} words - Great for SEO'
        score = 10
    elif words >= 300:
        status = f'Moderate content amount with {words} words - Consider adding more content'
        score = 7
    else:
        status = f'Low content amount with only {words} words - Add more content for better SEO'
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
            'status': 'No images found on the page',
            'total_images': 0,
            'missing_alt': 0,
            'score': 10
        }

    missing_alt = len([img for img in images if not img.get('alt')])

    if missing_alt == 0:
        status = f'All {total_images} images have alt text - Excellent for accessibility'
        score = 10
    else:
        status = f'{missing_alt} of {total_images} images are missing alt text - Add alt text for better accessibility'
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
        'score': round(total_score, 1),
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