"""GoNoGo SA Reviews API — Vercel Serverless FastAPI.

Endpoints:
  GET  /api/reviews?brand={brand}&category={category}  → fetch reviews for a brand
  GET  /api/reviews/all                                 → fetch all reviews
  POST /api/reviews                                     → submit a new review
  GET  /api/reviews/stats?brand={brand}&category={category} → aggregated stats
  GET  /api/health                                      → health check

Also serves static files (index.html, app.js, style.css, data files)
from the project root directory.

Uses /tmp for ephemeral storage on Vercel serverless.
Reviews persist within a single function instance's lifetime.
For production, connect to Upstash Redis, Vercel KV, or Vercel Postgres.
"""

import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel, Field

REVIEWS_FILE = "/tmp/gonogo_reviews.json"

# Project root directory (one level up from api/)
PROJECT_ROOT = Path(__file__).parent.parent

SCORE_KEYS = [
    "Compliance",
    "Customer Satisfaction",
    "Product Value",
    "Innovation",
    "Customer Support",
    "Accessibility & Security",
]

# MIME types for static files
MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".txt": "text/plain",
}


def load_reviews() -> list:
    if os.path.exists(REVIEWS_FILE):
        try:
            with open(REVIEWS_FILE, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []


def save_reviews(reviews: list):
    with open(REVIEWS_FILE, "w") as f:
        json.dump(reviews, f)


app = FastAPI(title="GoNoGo SA Reviews API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ReviewSubmission(BaseModel):
    category: str
    brand_name: str
    reviewer_name: str = Field(..., min_length=1, max_length=50)
    scores: dict
    review_text: Optional[str] = ""


@app.get("/api/reviews")
def get_reviews(
    brand: str = Query(..., description="Brand name"),
    category: str = Query(..., description="Category slug"),
):
    reviews = load_reviews()
    filtered = [
        r for r in reviews
        if r["category"] == category and r["brand_name"] == brand
    ]
    filtered.sort(key=lambda r: r.get("timestamp_epoch", 0), reverse=True)
    return [
        {
            "id": r["id"],
            "category": r["category"],
            "brand_name": r["brand_name"],
            "reviewer_name": r["reviewer_name"],
            "scores": r["scores"],
            "average_score": r["average_score"],
            "review_text": r["review_text"],
            "created_at": r["created_at"],
        }
        for r in filtered
    ]


@app.get("/api/reviews/all")
def get_all_reviews():
    reviews = load_reviews()
    reviews.sort(key=lambda r: r.get("timestamp_epoch", 0), reverse=True)
    return [
        {
            "id": r["id"],
            "category": r["category"],
            "brand_name": r["brand_name"],
            "reviewer_name": r["reviewer_name"],
            "scores": r["scores"],
            "average_score": r["average_score"],
            "review_text": r["review_text"],
            "created_at": r["created_at"],
        }
        for r in reviews
    ]


@app.get("/api/reviews/stats")
def get_review_stats(
    brand: str = Query(..., description="Brand name"),
    category: str = Query(..., description="Category slug"),
):
    reviews = load_reviews()
    filtered = [
        r for r in reviews
        if r["category"] == category and r["brand_name"] == brand
    ]

    if not filtered:
        return {"count": 0, "averages": {}, "overall_average": 0}

    totals = {k: 0 for k in SCORE_KEYS}
    for r in filtered:
        for k in SCORE_KEYS:
            totals[k] += r["scores"].get(k, 0)

    count = len(filtered)
    averages = {k: round(v / count) for k, v in totals.items()}
    overall = round(sum(averages.values()) / len(averages))

    return {
        "count": count,
        "averages": averages,
        "overall_average": overall,
    }


@app.post("/api/reviews", status_code=201)
def submit_review(review: ReviewSubmission):
    review_id = str(uuid.uuid4())[:8]
    now = datetime.now(timezone.utc)
    date_str = now.strftime("%d %b %Y")
    epoch = int(now.timestamp())

    scores = review.scores
    score_values = [int(scores.get(k, 0)) for k in SCORE_KEYS]
    average = round(sum(score_values) / len(score_values), 1)

    new_review = {
        "id": review_id,
        "category": review.category,
        "brand_name": review.brand_name,
        "reviewer_name": review.reviewer_name,
        "scores": {k: int(scores.get(k, 0)) for k in SCORE_KEYS},
        "average_score": average,
        "review_text": review.review_text or "",
        "created_at": date_str,
        "timestamp_epoch": epoch,
    }

    reviews = load_reviews()
    reviews.append(new_review)
    save_reviews(reviews)

    return {
        "id": review_id,
        "message": "Review submitted successfully",
        "average_score": average,
    }


@app.get("/api/health")
def health():
    reviews = load_reviews()
    return {"status": "ok", "total_reviews": len(reviews)}


# --- Static file serving ---
# Serve index.html at root
@app.get("/")
async def serve_root():
    index_path = PROJECT_ROOT / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path), media_type="text/html")
    return HTMLResponse("<h1>GoNoGo SA</h1><p>index.html not found</p>", status_code=404)


# Catch-all for static files
@app.get("/{file_path:path}")
async def serve_static(file_path: str):
    # Security: prevent directory traversal
    safe_path = Path(file_path).name if "/" not in file_path else file_path
    full_path = (PROJECT_ROOT / safe_path).resolve()
    
    # Ensure the path is within the project root
    try:
        full_path.relative_to(PROJECT_ROOT.resolve())
    except ValueError:
        return HTMLResponse("Not found", status_code=404)
    
    if full_path.exists() and full_path.is_file():
        suffix = full_path.suffix.lower()
        media_type = MIME_TYPES.get(suffix, "application/octet-stream")
        return FileResponse(str(full_path), media_type=media_type)
    
    return HTMLResponse("Not found", status_code=404)
