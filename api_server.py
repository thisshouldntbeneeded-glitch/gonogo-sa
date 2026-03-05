#!/usr/bin/env python3
"""GoNoGo SA — Unified API Server (FastAPI + SQLite)

Endpoints:
  GET  /api/brands                            → all brands grouped by category
  GET  /api/brands/:slug                      → brands in a category
  GET  /api/brand/:id                         → single brand detail
  GET  /api/categories                        → all categories
  GET  /api/top-brands?count=6                → top N brands by score
  GET  /api/stats                             → overall stats (brand count, category count)

  GET  /api/reviews?brand={name}&category={slug} → reviews for a brand
  GET  /api/reviews/all                       → all reviews (admin)
  POST /api/reviews                           → submit a new review

  POST /api/admin/brand                       → add or update a brand
  GET  /api/health                            → health check
"""

import sqlite3
import json
import uuid
import os
import re
from datetime import datetime, timezone
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "gonogo_sa.db")
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")


# ============================================================
# DATABASE SETUP
# ============================================================
def get_db():
    db = sqlite3.connect(DB_PATH, check_same_thread=False)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA journal_mode=WAL")
    return db


def init_db(db):
    # Reviews table
    db.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            brand_name TEXT NOT NULL,
            reviewer_name TEXT NOT NULL,
            compliance INTEGER DEFAULT 0,
            customer_satisfaction INTEGER DEFAULT 0,
            product_value INTEGER DEFAULT 0,
            innovation INTEGER DEFAULT 0,
            customer_support INTEGER DEFAULT 0,
            accessibility_security INTEGER DEFAULT 0,
            average_score REAL DEFAULT 0,
            review_text TEXT DEFAULT '',
            status TEXT DEFAULT 'pending',
            created_at TEXT NOT NULL,
            timestamp_epoch INTEGER NOT NULL
        )
    """)
    db.execute("""
        CREATE INDEX IF NOT EXISTS idx_reviews_brand
        ON reviews(category, brand_name)
    """)
    db.commit()


db = get_db()
init_db(db)


# ============================================================
# BRAND DATA — LOADED FROM JS FILES AT STARTUP
# ============================================================
def load_brand_data():
    """Parse the static JS data files and return structured brand data."""
    all_data = []

    # Read and parse each data_part file
    for part in ["A", "B", "C", "D", "E", "F"]:
        filepath = os.path.join(DATA_DIR, f"data_part{part}.js")
        if not os.path.exists(filepath):
            continue

        with open(filepath, "r") as f:
            content = f.read()

        # Extract the JSON array from the JS variable assignment
        # Format: var BRAND_DATA_PARTX = [...];
        match = re.search(r"=\s*(\[[\s\S]*\])\s*;?\s*$", content)
        if match:
            try:
                parsed = json.loads(match.group(1))
                all_data.extend(parsed)
            except json.JSONDecodeError as e:
                print(f"Warning: Could not parse {filepath}: {e}")

    return all_data


def slugify(name):
    return re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", name.lower()))


def normalize_brand(brand, category):
    """Convert a brand from the JS data format to a flat API-friendly format."""
    category_scores = {}
    for fb in brand.get("framework_breakdown", []):
        parts = fb["score"].split("/")
        score = float(parts[0])
        max_val = float(parts[1])
        category_scores[fb["category"]] = {
            "score": score,
            "max": max_val,
            "description": fb.get("description", ""),
        }

    gp_raw = (brand.get("app_ratings") or {}).get("google_play", "N/A")
    ios_raw = (brand.get("app_ratings") or {}).get("ios", "N/A")

    try:
        gp_score = float(gp_raw.replace("/5", ""))
    except (ValueError, AttributeError):
        gp_score = 0

    try:
        ios_score = float(ios_raw.replace("/5", ""))
    except (ValueError, AttributeError):
        ios_score = 0

    return {
        "id": slugify(brand["name"]),
        "name": brand["name"],
        "categorySlug": category["slug"],
        "categoryName": category["category"],
        "categoryIcon": category.get("icon", ""),
        "logo": brand.get("logo_url", ""),
        "website": brand.get("website_url", ""),
        "overallScore": brand.get("gonogo_score", 0),
        "verdict": "GO WITH CAUTION" if brand.get("verdict", "NOGO") == "CAUTION" else brand.get("verdict", "NOGO"),
        "categoryScores": category_scores,
        "scoringCategories": category.get("scoring_categories", []),
        "keyFeatures": brand.get("key_features", []),
        "pricing": brand.get("pricing", []),
        "appRatings": {
            "googlePlay": gp_raw,
            "ios": ios_raw,
            "googlePlayScore": gp_score,
            "iosScore": ios_score,
        },
        "strengths": brand.get("key_strengths", []),
        "concerns": brand.get("key_concerns", []),
        "socialSentiment": brand.get("social_sentiment", {}),
        "lastUpdated": "2026-03-01",
    }


# Load brand data at startup
BRAND_DATA_RAW = load_brand_data()
ALL_BRANDS = []
CATEGORIES = []

for cat in BRAND_DATA_RAW:
    cat_info = {
        "id": cat["slug"],
        "name": cat["category"],
        "icon": cat.get("icon", ""),
        "brandCount": len(cat.get("brands", [])),
        "scoringCategories": cat.get("scoring_categories", []),
    }
    CATEGORIES.append(cat_info)
    for b in cat.get("brands", []):
        ALL_BRANDS.append(normalize_brand(b, cat))

print(f"Loaded {len(ALL_BRANDS)} brands across {len(CATEGORIES)} categories")


# ============================================================
# FASTAPI APP
# ============================================================
@asynccontextmanager
async def lifespan(app):
    yield
    db.close()


app = FastAPI(title="GoNoGo SA API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# BRAND ENDPOINTS
# ============================================================
@app.get("/api/categories")
def get_categories():
    return CATEGORIES


@app.get("/api/brands")
def get_all_brands():
    return ALL_BRANDS


@app.get("/api/brands/{slug}")
def get_brands_by_category(slug: str):
    brands = [b for b in ALL_BRANDS if b["categorySlug"] == slug]
    if not brands:
        cat = next((c for c in CATEGORIES if c["id"] == slug), None)
        if not cat:
            raise HTTPException(status_code=404, detail="Category not found")
        return []
    return brands


@app.get("/api/brand/{brand_id}")
def get_brand(brand_id: str):
    brand = next((b for b in ALL_BRANDS if b["id"] == brand_id), None)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand


@app.get("/api/top-brands")
def get_top_brands(count: int = Query(default=6, ge=1, le=20)):
    sorted_brands = sorted(ALL_BRANDS, key=lambda b: b["overallScore"], reverse=True)
    return sorted_brands[:count]


@app.get("/api/stats")
def get_stats():
    go_count = sum(1 for b in ALL_BRANDS if b["verdict"] == "GO")
    caution_count = sum(1 for b in ALL_BRANDS if b["verdict"] == "GO WITH CAUTION")
    nogo_count = sum(1 for b in ALL_BRANDS if b["verdict"] == "NOGO")
    return {
        "totalBrands": len(ALL_BRANDS),
        "totalCategories": len(CATEGORIES),
        "goCount": go_count,
        "cautionCount": caution_count,
        "nogoCount": nogo_count,
        "averageScore": round(sum(b["overallScore"] for b in ALL_BRANDS) / max(len(ALL_BRANDS), 1), 1),
    }


# ============================================================
# REVIEW ENDPOINTS
# ============================================================
class ReviewSubmission(BaseModel):
    category: str
    brand_name: str
    reviewer_name: str = Field(..., min_length=1, max_length=50)
    scores: dict = {}  # Optional: { "Compliance": 75, ... }
    review_text: Optional[str] = ""


def row_to_review(row) -> dict:
    return {
        "id": row["id"],
        "category": row["category"],
        "brand_name": row["brand_name"],
        "reviewer_name": row["reviewer_name"],
        "scores": {
            "Compliance": row["compliance"],
            "Customer Satisfaction": row["customer_satisfaction"],
            "Product Value": row["product_value"],
            "Innovation": row["innovation"],
            "Customer Support": row["customer_support"],
            "Accessibility & Security": row["accessibility_security"],
        },
        "average_score": row["average_score"],
        "review_text": row["review_text"],
        "status": row["status"],
        "created_at": row["created_at"],
    }


@app.get("/api/reviews")
def get_reviews(
    brand: str = Query(..., description="Brand name"),
    category: str = Query(..., description="Category slug"),
):
    rows = db.execute(
        "SELECT * FROM reviews WHERE category = ? AND brand_name = ? ORDER BY timestamp_epoch DESC",
        [category, brand],
    ).fetchall()
    return [row_to_review(r) for r in rows]


@app.get("/api/reviews/all")
def get_all_reviews():
    rows = db.execute("SELECT * FROM reviews ORDER BY timestamp_epoch DESC").fetchall()
    return [row_to_review(r) for r in rows]


@app.post("/api/reviews", status_code=201)
def submit_review(review: ReviewSubmission):
    review_id = str(uuid.uuid4())[:8]
    now = datetime.now(timezone.utc)
    date_str = now.strftime("%d %b %Y")
    epoch = int(now.timestamp())

    scores = review.scores or {}
    compliance = int(scores.get("Compliance", 0))
    cust_sat = int(scores.get("Customer Satisfaction", 0))
    prod_val = int(scores.get("Product Value", 0))
    innovation = int(scores.get("Innovation", 0))
    cust_sup = int(scores.get("Customer Support", 0))
    acc_sec = int(scores.get("Accessibility & Security", 0))

    all_scores = [compliance, cust_sat, prod_val, innovation, cust_sup, acc_sec]
    average = round(sum(all_scores) / len(all_scores), 1) if any(all_scores) else 0

    db.execute(
        """INSERT INTO reviews
           (id, category, brand_name, reviewer_name,
            compliance, customer_satisfaction, product_value,
            innovation, customer_support, accessibility_security,
            average_score, review_text, status, created_at, timestamp_epoch)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        [
            review_id,
            review.category,
            review.brand_name,
            review.reviewer_name,
            compliance,
            cust_sat,
            prod_val,
            innovation,
            cust_sup,
            acc_sec,
            average,
            review.review_text or "",
            "pending",
            date_str,
            epoch,
        ],
    )
    db.commit()

    return {
        "id": review_id,
        "message": "Review submitted successfully",
        "average_score": average,
    }


@app.put("/api/reviews/{review_id}/status")
def update_review_status(review_id: str, status: str = Query(...)):
    if status not in ("pending", "approved", "rejected", "flagged"):
        raise HTTPException(status_code=400, detail="Invalid status")
    result = db.execute("UPDATE reviews SET status = ? WHERE id = ?", [status, review_id])
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"id": review_id, "status": status}


@app.get("/api/reviews/stats")
def get_review_stats(
    brand: str = Query(..., description="Brand name"),
    category: str = Query(..., description="Category slug"),
):
    rows = db.execute(
        "SELECT * FROM reviews WHERE category = ? AND brand_name = ?",
        [category, brand],
    ).fetchall()

    if not rows:
        return {"count": 0, "averages": {}, "overall_average": 0}

    totals = {
        "Compliance": 0,
        "Customer Satisfaction": 0,
        "Product Value": 0,
        "Innovation": 0,
        "Customer Support": 0,
        "Accessibility & Security": 0,
    }
    for r in rows:
        totals["Compliance"] += r["compliance"]
        totals["Customer Satisfaction"] += r["customer_satisfaction"]
        totals["Product Value"] += r["product_value"]
        totals["Innovation"] += r["innovation"]
        totals["Customer Support"] += r["customer_support"]
        totals["Accessibility & Security"] += r["accessibility_security"]

    count = len(rows)
    averages = {k: round(v / count) for k, v in totals.items()}
    overall = round(sum(averages.values()) / len(averages))

    return {
        "count": count,
        "averages": averages,
        "overall_average": overall,
    }


# ============================================================
# ADMIN ENDPOINTS
# ============================================================
class BrandUpdate(BaseModel):
    name: str
    categorySlug: str
    website: Optional[str] = ""
    logo: Optional[str] = ""
    scores: dict = {}  # { "Compliance": {"score": 19, "max": 20, "description": "..."}, ... }
    googlePlayRating: Optional[str] = "N/A"
    iosRating: Optional[str] = "N/A"
    keyFeatures: List[str] = []
    pricing: list = []
    keyStrengths: List[str] = []
    keyConcerns: List[str] = []


@app.post("/api/admin/brand")
def save_brand(brand: BrandUpdate):
    """Add or update a brand in the in-memory data and persist to local storage."""
    brand_id = slugify(brand.name)

    # Find existing category
    cat = next((c for c in BRAND_DATA_RAW if c["slug"] == brand.categorySlug), None)
    if not cat:
        raise HTTPException(status_code=400, detail="Category not found")

    # Build framework_breakdown
    framework = []
    raw_total = 0
    raw_max = 0
    for cat_name, data in brand.scores.items():
        score = float(data.get("score", 0))
        max_val = float(data.get("max", 0))
        raw_total += score
        raw_max += max_val
        framework.append({
            "category": cat_name,
            "score": f"{score}/{max_val}",
            "description": data.get("description", ""),
        })

    gonogo_score = round((raw_total / raw_max) * 100) if raw_max > 0 else 0
    if gonogo_score >= 80:
        verdict = "GO"
    elif gonogo_score >= 60:
        verdict = "GO WITH CAUTION"
    else:
        verdict = "NOGO"

    # Build the brand object in the JS data format
    new_brand_raw = {
        "name": brand.name,
        "gonogo_score": gonogo_score,
        "verdict": verdict,
        "logo_url": brand.logo or "",
        "website_url": brand.website or "",
        "framework_breakdown": framework,
        "key_features": brand.keyFeatures,
        "pricing": brand.pricing,
        "app_ratings": {
            "google_play": brand.googlePlayRating or "N/A",
            "ios": brand.iosRating or "N/A",
        },
        "key_strengths": brand.keyStrengths,
        "key_concerns": brand.keyConcerns,
        "social_sentiment": {},
    }

    # Update in-memory raw data
    existing_idx = None
    for i, b in enumerate(cat.get("brands", [])):
        if slugify(b["name"]) == brand_id:
            existing_idx = i
            break

    if existing_idx is not None:
        cat["brands"][existing_idx] = new_brand_raw
    else:
        cat["brands"].append(new_brand_raw)
        # Update category brand count
        for c in CATEGORIES:
            if c["id"] == brand.categorySlug:
                c["brandCount"] = len(cat["brands"])

    # Update normalized ALL_BRANDS
    normalized = normalize_brand(new_brand_raw, cat)
    existing_norm_idx = None
    for i, b in enumerate(ALL_BRANDS):
        if b["id"] == brand_id:
            existing_norm_idx = i
            break

    if existing_norm_idx is not None:
        ALL_BRANDS[existing_norm_idx] = normalized
    else:
        ALL_BRANDS.append(normalized)

    return {
        "id": brand_id,
        "message": "Brand saved successfully",
        "gonogo_score": gonogo_score,
        "verdict": verdict,
    }


# ============================================================
# HEALTH
# ============================================================
@app.get("/api/health")
def health():
    review_count = db.execute("SELECT COUNT(*) FROM reviews").fetchone()[0]
    return {
        "status": "ok",
        "total_brands": len(ALL_BRANDS),
        "total_categories": len(CATEGORIES),
        "total_reviews": review_count,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
