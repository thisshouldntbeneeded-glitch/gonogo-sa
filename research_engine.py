#!/usr/bin/env python3
"""
GoNoGo SA — Auto-Research Engine
Fetches real public data for South African brands:
- Google Play Store ratings
- Apple App Store ratings
- Hellopeter ratings
- General web presence signals
- AI-powered scoring and narrative generation via OpenAI

Updates brand data in memory and local JSON files.
Sync back to Google Sheets happens via daily cron.

SCORING FRAMEWORK (always sums to 100):
  Compliance .............. /20
  CustomerSatisfaction .... /20
  ProductValue ............ /30
  Innovation .............. /10
  CustomerSupport ......... /10
  AccessibilitySecurity ... /10
"""

import httpx
import re
import json
import os
from datetime import datetime
from typing import Optional
from openai import AsyncOpenAI          # pip install openai

TIMEOUT = httpx.Timeout(15.0, connect=10.0)
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-ZA,en;q=0.9',
}

# ------------------------------------------------------------------
# Scoring constants
# ------------------------------------------------------------------
SCORE_WEIGHTS = {
    'Compliance':            20,
    'CustomerSatisfaction':  20,
    'ProductValue':          30,
    'Innovation':            10,
    'CustomerSupport':       10,
    'AccessibilitySecurity': 10,
}
assert sum(SCORE_WEIGHTS.values()) == 100

VERDICT_THRESHOLDS = {
    'GO':                80,
    'GO WITH CAUTION':   65,
    'AVOID':              0,
}

# ------------------------------------------------------------------
# LLM scoring prompt — this IS the research brief, embedded verbatim
# ------------------------------------------------------------------
SCORING_SYSTEM_PROMPT = """You are the GoNoGo SA brand analyst. You will receive an
evidence bundle about a South African brand and must return a JSON object with
scored fields ready for CSV export. Every field must be clean public-facing copy
with NO inline references, tags or markup.

━━━ SCORING FRAMEWORK (must always sum to exactly 100) ━━━

Compliance_Max            = 20
CustomerSatisfaction_Max  = 20
ProductValue_Max          = 30
Innovation_Max            = 10
CustomerSupport_Max       = 10
AccessibilitySecurity_Max = 10

SCORING GUIDE PER DIMENSION:

Compliance (0-20)
  18-20  Fully licensed/regulated, strong governance, no enforcement actions,
         audited quality reports.
  15-17  Properly licensed but minor regulatory issues or opaque ownership.
  10-14  Documented sanctions, whistle-blower reports or systemic issues but
         still formally operating.
  0-9    Serious ongoing non-compliance, scandals, or basic standards not met.

CustomerSatisfaction (0-20)
  Use aggregated ratings directionally (4.5/5 ≈ high; 3.0/5 ≈ mid; 2.0/5 ≈ poor).
  17-20  Consistently high ratings, complaints mostly isolated.
  13-16  Mixed but leaning positive, clear strengths and some repeating issues.
  8-12   Clearly mixed or leaning negative, serious recurring patterns.
  0-7    Widely negative or credible evidence of harm.

ProductValue (0-30)
  Weigh price relative to quality, reliability and breadth vs peers.
  25-30  Fair pricing and clearly delivers on promises vs peers.
  18-24  Average/OK pricing or quality.
  0-17   "Cheap but broken" or "expensive and under-delivering".

Innovation (0-10)
  8-10   Clear meaningful innovations relative to local market.
  4-7    Keeps up with industry but not a leader.
  0-3    Stagnant, copy-cat or outdated.

CustomerSupport (0-10)
  Score channels, responsiveness and escalation. Higher if praised in reviews,
  multi-channel and 24/7 when appropriate. Lower if recurring complaint theme.

AccessibilitySecurity (0-10)
  Accessibility: geographic reach, digital access (apps/mobile), inclusion.
  Security: data protection, physical safety, account/funds safety.
  High for broad reach + no major incidents. Lower for documented breaches,
  safety incidents or severe geographic gaps.

VERDICT LOGIC:
  >= 80  →  GO
  65-79  →  GO WITH CAUTION
  < 65   →  AVOID (unless critical public service with no alternative,
             then GO WITH CAUTION with explicit caveat)

━━━ NARRATIVE RULES ━━━

Overview: 2-3 sentences. What it is (type, size, geography), how it positions
itself, standout features.

RatingSummary: 2-3 sentences. Verdict logic ("earns a GO because…"), main
positives, main risks/caveats.

KeyFeatures: Comma-separated concrete offerings (products, services,
capabilities) — not adjectives.

KeyStrengths: One dense sentence, 3-4 distinct strengths.

KeyConcerns: One dense sentence, 3-4 distinct risks/issues with frequency
or severity where relevant.

Pricing: One paragraph describing positioning vs peers (premium/mid/budget/
free public/medical-aid-based). No specific tariff tables.

SocialSentiment_Summary: One sentence overall tone.
SocialSentiment_Positive: Short phrase of what fans like.
SocialSentiment_Concerns: Short phrase of main complaint themes.

Each dimension also needs a _Description field: 1-2 sentences explaining
the score using evidence from the bundle.

TONE: Neutral, evidence-driven. No marketing fluff, no sensationalism.
Distinguish systemic issues from isolated anecdotes. Use "documented evidence"
language, not accusations.

━━━ OUTPUT FORMAT ━━━

Return ONLY valid JSON matching this schema (no markdown fencing):
{
  "BrandName": "",
  "CategoryName": "",
  "CategorySlug": "",
  "CategoryIcon": "",
  "WebsiteURL": "",
  "LogoURL": "",
  "GoNoGoScore": 0,
  "Verdict": "",
  "Overview": "",
  "RatingSummary": "",
  "GooglePlay_Rating": "",
  "iOS_Rating": "",
  "KeyFeatures": "",
  "KeyStrengths": "",
  "KeyConcerns": "",
  "Pricing": "",
  "SocialSentiment_Summary": "",
  "SocialSentiment_Positive": "",
  "SocialSentiment_Concerns": "",
  "Compliance_Score": 0,
  "Compliance_Max": 20,
  "Compliance_Description": "",
  "CustomerSatisfaction_Score": 0,
  "CustomerSatisfaction_Max": 20,
  "CustomerSatisfaction_Description": "",
  "ProductValue_Score": 0,
  "ProductValue_Max": 30,
  "ProductValue_Description": "",
  "Innovation_Score": 0,
  "Innovation_Max": 10,
  "Innovation_Description": "",
  "CustomerSupport_Score": 0,
  "CustomerSupport_Max": 10,
  "CustomerSupport_Description": "",
  "AccessibilitySecurity_Score": 0,
  "AccessibilitySecurity_Max": 10,
  "AccessibilitySecurity_Description": "",
  "LastUpdated": ""
}

CRITICAL: The six _Score fields MUST sum to GoNoGoScore.
The six _Max fields are always 20, 20, 30, 10, 10, 10.
No score may exceed its max. GoNoGoScore must equal the sum of the six scores.
"""


# ------------------------------------------------------------------
# Evidence gathering (existing scrapers + new helpers)
# ------------------------------------------------------------------

async def research_brand(brand_name: str, category: str = '',
                         website: str = '', current_data: dict = None) -> dict:
    """
    Full research pipeline for a single brand.
    1. Scrape public evidence (Play Store, App Store, Hellopeter, website).
    2. Build evidence bundle.
    3. Send to LLM for scoring + narrative generation.
    4. Validate and return structured CSV-ready row.
    """
    results = {
        'brand_name': brand_name,
        'category': category,
        'researched_at': datetime.now().strftime('%Y-%m-%d %H:%M'),
        'fields_updated': [],
        'errors': [],
        'evidence': {},
        'data': {}
    }

    async with httpx.AsyncClient(timeout=TIMEOUT, headers=HEADERS,
                                 follow_redirects=True) as client:
        gp_rating = await fetch_google_play_rating(client, brand_name)
        if gp_rating:
            results['evidence']['google_play_rating'] = gp_rating
            results['fields_updated'].append('Google Play rating')

        ios_rating = await fetch_ios_rating(client, brand_name)
        if ios_rating:
            results['evidence']['ios_rating'] = ios_rating
            results['fields_updated'].append('iOS rating')

        hp_data = await fetch_hellopeter_data(client, brand_name)
        if hp_data:
            results['evidence']['hellopeter'] = hp_data
            results['fields_updated'].append('Hellopeter data')

        if website:
            site_status = await check_website_status(client, website)
            results['evidence']['website_status'] = site_status
            results['fields_updated'].append('Website status')

        web_evidence = await fetch_web_evidence(client, brand_name, category)
        if web_evidence:
            results['evidence']['web_research'] = web_evidence
            results['fields_updated'].append('Web research')

    scored_row = await score_brand_with_llm(
        brand_name=brand_name,
        category=category,
        website=website,
        evidence=results['evidence'],
        current_data=current_data
    )

    if scored_row:
        scored_row = validate_and_fix_scores(scored_row)
        results['data'] = scored_row
        results['fields_updated'].append('LLM scoring complete')
    else:
        results['errors'].append('LLM scoring failed')

    results['data']['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')
    return results


# ------------------------------------------------------------------
# Web evidence fetcher (reviews, news, regulatory)
# ------------------------------------------------------------------

async def fetch_web_evidence(client: httpx.AsyncClient, brand_name: str,
                              category: str = '') -> Optional[dict]:
    """
    Fetch supplementary web evidence: review aggregations, news, regulatory.
    Uses Google search scraping as a lightweight fallback.
    Replace with SerpAPI / Bing API / your preferred provider for production.
    """
    evidence = {
        'review_snippets': [],
        'news_snippets': [],
        'regulatory_snippets': [],
    }

    queries = [
        f'{brand_name} South Africa reviews',
        f'{brand_name} South Africa complaints',
        f'{brand_name} South Africa {category} regulatory compliance',
    ]

    for query in queries:
        try:
            search_url = f'https://www.google.com/search?q={query.replace(" ", "+")}&gl=ZA&num=5'
            resp = await client.get(search_url)
            if resp.status_code == 200:
                snippets = re.findall(
                    r'<span[^>]*class="[^"]*"[^>]*>(.*?)</span>', resp.text
                )
                clean = [re.sub(r'<[^>]+>', '', s).strip()
                         for s in snippets if len(s) > 40][:5]

                if 'complaints' in query:
                    evidence['review_snippets'].extend(clean)
                elif 'regulatory' in query:
                    evidence['regulatory_snippets'].extend(clean)
                else:
                    evidence['review_snippets'].extend(clean)
        except Exception:
            continue

    try:
        slug = brand_name.lower().replace(' ', '-')
        tp_url = f'https://www.trustpilot.com/review/{slug}.co.za'
        resp = await client.get(tp_url)
        if resp.status_code == 200:
            rating_match = re.search(r'"ratingValue"\s*:\s*"?(\d+\.?\d*)', resp.text)
            count_match = re.search(r'"reviewCount"\s*:\s*"?(\d+)', resp.text)
            if rating_match:
                evidence['trustpilot_rating'] = float(rating_match.group(1))
            if count_match:
                evidence['trustpilot_reviews'] = int(count_match.group(1))
    except Exception:
        pass

    return evidence if any(evidence.values()) else None


# ------------------------------------------------------------------
# LLM scoring engine
# ------------------------------------------------------------------

async def score_brand_with_llm(brand_name: str, category: str, website: str,
                                evidence: dict, current_data: dict = None) -> Optional[dict]:
    """
    Send the evidence bundle to OpenAI and get back a fully scored,
    narrative-complete JSON row for the CSV.
    """
    user_prompt = build_evidence_prompt(brand_name, category, website,
                                        evidence, current_data)
    try:
        ai = AsyncOpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        response = await ai.chat.completions.create(
            model=os.getenv('GONOGO_MODEL', 'gpt-4o'),
            temperature=0.3,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SCORING_SYSTEM_PROMPT},
                {"role": "user",   "content": user_prompt},
            ]
        )
        raw = response.choices[0].message.content
        scored = json.loads(raw)
        return scored
    except Exception as e:
        print(f"[LLM ERROR] {brand_name}: {e}")
        return None


def build_evidence_prompt(brand_name: str, category: str, website: str,
                           evidence: dict, current_data: dict = None) -> str:
    """Assemble a structured evidence prompt for the LLM."""
    parts = [
        f"# Brand: {brand_name}",
        f"Category: {category}" if category else "",
        f"Website: {website}" if website else "",
        "",
        "## Gathered Evidence",
        "",
    ]

    gp = evidence.get('google_play_rating')
    ios = evidence.get('ios_rating')
    if gp or ios:
        parts.append("### App Ratings")
        if gp:  parts.append(f"- Google Play: {gp}")
        if ios: parts.append(f"- iOS App Store: {ios}")
        parts.append("")

    hp = evidence.get('hellopeter')
    if hp:
        parts.append("### Hellopeter")
        for k, v in hp.items():
            parts.append(f"- {k}: {v}")
        parts.append("")

    tp_rating = evidence.get('web_research', {}).get('trustpilot_rating')
    tp_count = evidence.get('web_research', {}).get('trustpilot_reviews')
    if tp_rating:
        parts.append("### Trustpilot")
        parts.append(f"- Rating: {tp_rating}/5")
        if tp_count: parts.append(f"- Reviews: {tp_count}")
        parts.append("")

    ws = evidence.get('website_status')
    if ws:
        parts.append("### Website Status")
        parts.append(f"- Accessible: {ws.get('accessible')}")
        parts.append(f"- HTTPS: {ws.get('https')}")
        parts.append(f"- Response time: {ws.get('response_time_ms')}ms")
        parts.append("")

    wr = evidence.get('web_research', {})
    for section, key in [('Review Snippets', 'review_snippets'),
                         ('News Snippets', 'news_snippets'),
                         ('Regulatory Snippets', 'regulatory_snippets')]:
        items = wr.get(key, [])
        if items:
            parts.append(f"### {section}")
            for item in items[:8]:
                parts.append(f"- {item}")
            parts.append("")

    if current_data:
        parts.append("### Existing Brand Data (for context only)")
        safe_keys = ['Overview', 'KeyFeatures', 'KeyStrengths', 'KeyConcerns',
                     'Verdict', 'GoNoGoScore', 'Pricing']
        for k in safe_keys:
            if k in current_data:
                parts.append(f"- {k}: {current_data[k]}")
        parts.append("")

    parts.append("## Instructions")
    parts.append("Using ONLY the evidence above (and your general knowledge of "
                 "South African brands if needed to fill gaps), produce the full "
                 "JSON object as specified in your system prompt.")
    parts.append("Ensure all six dimension scores sum to GoNoGoScore and that "
                 "GoNoGoScore determines the Verdict per the threshold rules.")
    parts.append(f"Set LastUpdated to {datetime.now().strftime('%Y-%m-%d')}.")
    parts.append(f"Set CategoryName to '{category}' if provided.")
    parts.append("Use https://cdn.brandfetch.io/<domain>/w/400/h/400/logo.png "
                 f"for LogoURL, deriving domain from the website: {website}")

    return "\n".join(parts)


# ------------------------------------------------------------------
# Score validation and auto-correction
# ------------------------------------------------------------------

def validate_and_fix_scores(row: dict) -> dict:
    """
    Ensure the six dimension scores sum to GoNoGoScore,
    no score exceeds its max, and the verdict matches the total.
    """
    dims = [
        ('Compliance_Score',           'Compliance_Max'),
        ('CustomerSatisfaction_Score', 'CustomerSatisfaction_Max'),
        ('ProductValue_Score',         'ProductValue_Max'),
        ('Innovation_Score',           'Innovation_Max'),
        ('CustomerSupport_Score',      'CustomerSupport_Max'),
        ('AccessibilitySecurity_Score','AccessibilitySecurity_Max'),
    ]

    row['Compliance_Max'] = 20
    row['CustomerSatisfaction_Max'] = 20
    row['ProductValue_Max'] = 30
    row['Innovation_Max'] = 10
    row['CustomerSupport_Max'] = 10
    row['AccessibilitySecurity_Max'] = 10

    for score_key, max_key in dims:
        val = row.get(score_key, 0)
        mx = row[max_key]
        row[score_key] = max(0, min(int(round(val)), mx))

    total = sum(row[s] for s, _ in dims)
    row['GoNoGoScore'] = total

    if total >= VERDICT_THRESHOLDS['GO']:
        row['Verdict'] = 'GO'
    elif total >= VERDICT_THRESHOLDS['GO WITH CAUTION']:
        row['Verdict'] = 'GO WITH CAUTION'
    else:
        row['Verdict'] = 'AVOID'

    return row


# ------------------------------------------------------------------
# Original scrapers (unchanged)
# ------------------------------------------------------------------

async def fetch_google_play_rating(client: httpx.AsyncClient,
                                    brand_name: str) -> Optional[str]:
    try:
        search_name = brand_name.lower().replace(' ', '+')
        search_url = (f'https://play.google.com/store/search?q={search_name}'
                      f'&c=apps&gl=ZA')
        resp = await client.get(search_url)
        if resp.status_code != 200:
            return None

        text = resp.text
        rating_patterns = [
            r'<div[^>]*aria-label="Rated (\d\.\d) stars[^"]*"',
            r'>(\d\.\d)</div>.*?star',
            r'Rated (\d\.\d) out of',
        ]
        for pattern in rating_patterns:
            match = re.search(pattern, text)
            if match:
                return f'{match.group(1)}/5'

        package_match = re.search(
            r'href="/store/apps/details\?id=([^"&]+)"', text)
        if package_match:
            package_id = package_match.group(1)
            app_url = (f'https://play.google.com/store/apps/details'
                       f'?id={package_id}&gl=ZA')
            app_resp = await client.get(app_url)
            if app_resp.status_code == 200:
                for pattern in rating_patterns:
                    match = re.search(pattern, app_resp.text)
                    if match:
                        return f'{match.group(1)}/5'
    except Exception:
        pass
    return None


async def fetch_ios_rating(client: httpx.AsyncClient,
                            brand_name: str) -> Optional[str]:
    try:
        search_url = (f'https://itunes.apple.com/search?term={brand_name}'
                      f'&country=ZA&entity=software&limit=3')
        resp = await client.get(search_url)
        if resp.status_code != 200:
            return None

        data = resp.json()
        results = data.get('results', [])
        if not results:
            return None

        brand_lower = brand_name.lower()
        for app in results:
            app_name = app.get('trackName', '').lower()
            seller = app.get('sellerName', '').lower()
            if (brand_lower in app_name or brand_lower in seller
                    or any(w in app_name for w in brand_lower.split())):
                rating = app.get('averageUserRating')
                if rating:
                    return f'{round(rating, 1)}/5'

        if results[0].get('averageUserRating'):
            return f'{round(results[0]["averageUserRating"], 1)}/5'
    except Exception:
        pass
    return None


async def fetch_hellopeter_data(client: httpx.AsyncClient,
                                 brand_name: str) -> Optional[dict]:
    try:
        slug = brand_name.lower().replace(' ', '-').replace('&', 'and')
        urls_to_try = [
            f'https://www.hellopeter.com/{slug}',
            f'https://www.hellopeter.com/{slug.replace("-", "")}',
        ]
        for url in urls_to_try:
            try:
                resp = await client.get(url, follow_redirects=True)
                if resp.status_code == 200:
                    text = resp.text
                    trust_match = re.search(
                        r'Trust\s*Index[^\d]*(\d+(?:\.\d+)?)',
                        text, re.IGNORECASE)
                    rating_match = re.search(
                        r'(\d+(?:\.\d+)?)\s*/\s*10', text)
                    star_match = re.search(
                        r'(\d+(?:\.\d+)?)\s*out\s*of\s*5', text)
                    review_count_match = re.search(
                        r'([\d,]+)\s*(?:reviews?|ratings?)',
                        text, re.IGNORECASE)

                    result = {}
                    if trust_match:
                        result['trust_index'] = float(trust_match.group(1))
                    if rating_match:
                        result['rating'] = float(rating_match.group(1))
                    if star_match:
                        result['star_rating'] = float(star_match.group(1))
                    if review_count_match:
                        result['review_count'] = (
                            review_count_match.group(1).replace(',', ''))
                    if result:
                        result['url'] = url
                        return result
            except Exception:
                continue
    except Exception:
        pass
    return None


async def check_website_status(client: httpx.AsyncClient,
                                website: str) -> dict:
    result = {
        'url': website,
        'accessible': False,
        'https': website.startswith('https'),
        'response_time_ms': None
    }
    try:
        if not website.startswith('http'):
            website = 'https://' + website
        import time
        start = time.time()
        resp = await client.head(website, follow_redirects=True)
        elapsed = round((time.time() - start) * 1000)
        result['accessible'] = resp.status_code < 400
        result['response_time_ms'] = elapsed
        result['status_code'] = resp.status_code
        result['https'] = str(resp.url).startswith('https')
    except Exception as e:
        result['error'] = str(e)[:100]
    return result


# ------------------------------------------------------------------
# Apply research results to brand data
# ------------------------------------------------------------------

def apply_research_to_brand(brand_data: dict, research: dict) -> tuple:
    changes = []
    data = research.get('data', {})

    if data and 'GoNoGoScore' in data:
        csv_fields = [
            'GoNoGoScore', 'Verdict', 'Overview', 'RatingSummary',
            'GooglePlay_Rating', 'iOS_Rating',
            'KeyFeatures', 'KeyStrengths', 'KeyConcerns', 'Pricing',
            'SocialSentiment_Summary', 'SocialSentiment_Positive',
            'SocialSentiment_Concerns',
            'Compliance_Score', 'Compliance_Max', 'Compliance_Description',
            'CustomerSatisfaction_Score', 'CustomerSatisfaction_Max',
            'CustomerSatisfaction_Description',
            'ProductValue_Score', 'ProductValue_Max',
            'ProductValue_Description',
            'Innovation_Score', 'Innovation_Max', 'Innovation_Description',
            'CustomerSupport_Score', 'CustomerSupport_Max',
            'CustomerSupport_Description',
            'AccessibilitySecurity_Score', 'AccessibilitySecurity_Max',
            'AccessibilitySecurity_Description',
            'LastUpdated', 'LogoURL', 'CategoryName', 'CategorySlug',
            'CategoryIcon', 'WebsiteURL',
        ]
        for field in csv_fields:
            if field in data:
                old = brand_data.get(field, '')
                new = data[field]
                if old != new:
                    brand_data[field] = new
                    changes.append(f'{field}: {str(old)[:40]} -> {str(new)[:40]}')

    evidence = research.get('evidence', {})
    if 'google_play_rating' in evidence:
        if 'appRatings' not in brand_data:
            brand_data['appRatings'] = {}
        brand_data['appRatings']['googlePlay'] = evidence['google_play_rating']
        brand_data['appRatings']['googlePlayScore'] = float(
            evidence['google_play_rating'].replace('/5', ''))

    if 'ios_rating' in evidence:
        if 'appRatings' not in brand_data:
            brand_data['appRatings'] = {}
        brand_data['appRatings']['ios'] = evidence['ios_rating']
        brand_data['appRatings']['iosScore'] = float(
            evidence['ios_rating'].replace('/5', ''))

    brand_data['lastUpdated'] = data.get(
        'lastUpdated', datetime.now().strftime('%Y-%m-%d'))
    changes.append(f'Last updated: {brand_data["lastUpdated"]}')

    return brand_data, changes


# ------------------------------------------------------------------
# Batch runner
# ------------------------------------------------------------------

async def research_brands_batch(brands: list[dict]) -> list[dict]:
    import asyncio
    results = []
    for brand in brands:
        print(f"[RESEARCHING] {brand['name']}...")
        result = await research_brand(
            brand_name=brand['name'],
            category=brand.get('category', ''),
            website=brand.get('website', ''),
            current_data=brand.get('data', {})
        )
        results.append(result)
        await asyncio.sleep(2)
    return results


# ------------------------------------------------------------------
# CLI entry point
# ------------------------------------------------------------------

if __name__ == '__main__':
    import asyncio

    test_brands = [
        {
            'name': 'Hollywoodbets',
            'category': 'Online Casinos & Bookmakers',
            'website': 'https://www.hollywoodbets.net',
            'data': {}
        },
    ]

    async def main():
        results = await research_brands_batch(test_brands)
        for r in results:
            print(json.dumps(r, indent=2, default=str))
            fname = f"research_{r['brand_name'].lower().replace(' ', '_')}.json"
            with open(fname, 'w') as f:
                json.dump(r, f, indent=2, default=str)
            print(f"[SAVED] {fname}")

    asyncio.run(main())
