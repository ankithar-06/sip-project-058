import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from database import (
    analytics_collection,
    businesses_collection,
    products_collection,
    collaborations_collection,
    marketing_collection,
    format_doc,
)
from auth import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["Smart Business Analytics"])


@router.get("/overview")
def get_business_analytics(current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Returns actual recorded performance analytics for the logged-in MSME owner.
    Does not use fabricated numbers.
    """
    user_id = current_user["id"]
    business = businesses_collection.find_one({"owner_id": user_id})
    if not business:
        return {
            "has_business": False,
            "profile_views": 0,
            "product_count": 0,
            "collaboration_requests": 0,
            "marketing_generations": 0,
            "inquiries_count": 0,
            "activity_log": [],
            "weekly_timeline": [],
        }

    business_id = str(business["_id"])

    # 1. Real Product Count
    actual_product_count = products_collection.count_documents({"business_id": business_id})

    # 2. Real Collaboration Requests Received
    actual_collab_count = collaborations_collection.count_documents({"receiver_business_id": business_id})

    # 3. Real Marketing Content Generated
    actual_marketing_count = marketing_collection.count_documents({"business_id": business_id})

    # 4. Analytics record
    analytics = analytics_collection.find_one({"business_id": business_id})
    profile_views = analytics.get("profile_views", 0) if analytics else 0
    inquiries_count = analytics.get("product_inquiries", 0) if analytics else 0
    activity_log = analytics.get("activity_log", []) if analytics else []

    # 5. Build weekly activity breakdown for Recharts
    # Days of current week (Mon through Sun or last 7 days)
    today = datetime.date.today()
    days_map = {}
    for i in range(6, -1, -1):
        day_date = today - datetime.timedelta(days=i)
        day_str = day_date.strftime("%a")  # Mon, Tue, etc.
        days_map[day_date.isoformat()] = {"day": day_str, "views": 0, "activities": 0}

    # Count real events per day from activity_log
    for act in activity_log:
        ts = act.get("timestamp")
        if ts:
            try:
                date_key = ts.split("T")[0]
                if date_key in days_map:
                    days_map[date_key]["activities"] += 1
                    if "Viewed" in act.get("action", ""):
                        days_map[date_key]["views"] += 1
            except Exception:
                pass

    weekly_timeline = list(days_map.values())

    return {
        "has_business": True,
        "business_name": business.get("name"),
        "business_id": business_id,
        "profile_views": profile_views,
        "product_count": actual_product_count,
        "collaboration_requests": actual_collab_count,
        "marketing_generations": actual_marketing_count,
        "inquiries_count": inquiries_count,
        "activity_log": activity_log[-10:][::-1],  # latest 10 activities in reverse
        "weekly_timeline": weekly_timeline,
    }


@router.post("/inquiry/{business_id}")
def record_inquiry(business_id: str):
    """Called when a customer clicks to contact or enquire on a public business page."""
    try:
        oid = ObjectId(business_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid business ID format.")

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    analytics_collection.update_one(
        {"business_id": business_id},
        {
            "$inc": {"product_inquiries": 1},
            "$push": {
                "activity_log": {
                    "$each": [{
                        "action": "Customer Inquiry",
                        "timestamp": now,
                        "details": "Customer initiated contact via website/WhatsApp"
                    }],
                    "$slice": -50
                }
            },
            "$set": {"updated_at": now}
        },
        upsert=True,
    )
    return {"status": "success", "message": "Inquiry recorded"}
