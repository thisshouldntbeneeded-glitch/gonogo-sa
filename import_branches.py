#!/usr/bin/env python3
"""
GoNoGo SA — Import branches from CSV into Supabase.

Usage:
    python import_branches.py

Reads gonogo_branches_grand.csv and inserts rows into the 'branches' table.
Also creates/updates the two branch categories (traffic-department, home-affairs).

Requires: pip install requests
"""

import csv
import json
import os
import sys
import requests

SUPABASE_URL = "https://fnpxaneextqidbessnej.supabase.co"
SUPABASE_ANON_KEY = "sb_publishable_132Gl37kwIXtdJc5VHtGCw_iXPxa6cW"
CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "gonogo_branches_grand.csv")
REGION = "za"

HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates,return=representation",
}

CATEGORY_MAP = {
    "traffic": {
        "slug": "traffic-department",
        "name": "Traffic Departments",
        "icon": "fa-car",
    },
    "home": {
        "slug": "home-affairs",
        "name": "Home Affairs",
        "icon": "fa-building-columns",
    },
}


def supabase_upsert(table, rows):
    """Upsert rows into a Supabase table."""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    resp = requests.post(url, headers=HEADERS, json=rows)
    if resp.status_code not in (200, 201):
        print(f"ERROR upserting into {table}: {resp.status_code} {resp.text}")
        sys.exit(1)
    return resp.json()


def create_categories():
    """Create or update the two branch categories."""
    cats = []
    for dept, info in CATEGORY_MAP.items():
        cats.append({
            "slug": info["slug"],
            "name": info["name"],
            "icon": info["icon"],
            "region": REGION,
            "category_type": "branch",
            "scoring_categories": [
                {"name": "Compliance", "max": 20},
                {"name": "Customer Satisfaction", "max": 25},
                {"name": "Service Offering", "max": 25},
                {"name": "Innovation", "max": 10},
                {"name": "Customer Support", "max": 15},
                {"name": "Accessibility & Security", "max": 10},
            ],
        })
    result = supabase_upsert("categories", cats)
    print(f"Categories upserted: {len(result)}")


def verdict_from_score(score):
    if score >= 75:
        return "GO"
    elif score >= 50:
        return "GO WITH CAUTION"
    else:
        return "NOGO"


def import_branches():
    """Read CSV and insert branch rows."""
    csv_path = CSV_PATH
    if not os.path.exists(csv_path):
        # Try current directory
        csv_path = "gonogo_branches_grand.csv"
    if not os.path.exists(csv_path):
        print(f"CSV not found at {CSV_PATH} or current directory")
        sys.exit(1)

    rows = []
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            dept = r["department_type"].strip()
            cat_info = CATEGORY_MAP.get(dept)
            if not cat_info:
                print(f"WARNING: Unknown department_type '{dept}', skipping")
                continue

            score = int(r["total_score"].strip())
            rows.append({
                "branch_id": r["branch_id"].strip(),
                "department_type": dept,
                "category_slug": cat_info["slug"],
                "province": r["province"].strip(),
                "branch_name": r["branch_name"].strip(),
                "total_score": score,
                "verdict": verdict_from_score(score),
                "compliance": int(r["compliance"].strip()),
                "customer_satisfaction": int(r["customer_satisfaction"].strip()),
                "service_offering": int(r["service_offering"].strip()),
                "innovation": int(r["innovation"].strip()),
                "customer_support": int(r["customer_support"].strip()),
                "accessibility_security": int(r["accessibility_security"].strip()),
                "manager": r["manager"].strip(),
                "manager_email": r["manager_email"].strip(),
                "telephone": r["telephone"].strip(),
                "address": r["address"].strip(),
                "hours": r["hours"].strip(),
                "downtime": r["downtime"].strip(),
                "last_corruption": r["last_corruption"].strip(),
                "sentiment_summary": r["sentiment_summary"].strip(),
                "sentiment_positive": r["sentiment_positive"].strip(),
                "sentiment_negative": r["sentiment_negative"].strip(),
                "region": REGION,
            })

    if not rows:
        print("No rows found in CSV")
        sys.exit(1)

    result = supabase_upsert("branches", rows)
    print(f"Branches upserted: {len(result)}")


if __name__ == "__main__":
    print("Creating branch categories...")
    create_categories()
    print("Importing branches from CSV...")
    import_branches()
    print("Done!")
