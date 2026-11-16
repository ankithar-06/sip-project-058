import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List

from database import (
    businesses_collection,
    products_collection,
    analytics_collection,
    format_doc,
)
from auth import get_current_user
from schemas import BusinessCreate, BusinessUpdate, BusinessResponse

router = APIRouter(prefix="/api/businesses", tags=["Businesses"])


@router.post("/", response_model=BusinessResponse, status_code=201)
def create_business(business_data: BusinessCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]

    # Check if this user already has a registered business
    existing_business = businesses_collection.find_one({"owner_id": user_id})
    if existing_business:
        raise HTTPException(
            status_code=400,
            detail="You already have a registered business profile. Please update the existing profile.",
        )

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    business_doc = {
        "owner_id": user_id,
        "name": business_data.name.strip(),
        "owner_name": business_data.owner_name or current_user.get("name", ""),
        "category": business_data.category.strip(),
        "description": business_data.description or "",
        "location": business_data.location.strip(),
        "city": business_data.city.strip(),
        "pin_code": business_data.pin_code.strip(),
        "contact_email": str(business_data.contact_email) if business_data.contact_email else current_user.get("email"),
        "phone": business_data.phone or "",
        "whatsapp": business_data.whatsapp or business_data.phone or "",
        "website": business_data.website or "",
        "logo_url": business_data.logo_url or "",
        "operating_hours": business_data.operating_hours or "9:00 AM - 7:00 PM",
        "created_at": now,
        "updated_at": now,
    }

    result = businesses_collection.insert_one(business_doc)
    business_id = str(result.inserted_id)

    # Initialize analytics document for this business
    analytics_collection.insert_one({
        "business_id": business_id,
        "profile_views": 0,
        "product_inquiries": 0,
        "collaboration_requests": 0,
        "marketing_generations": 0,
        "activity_log": [{
            "action": "Profile Created",
            "timestamp": now,
            "details": f"Registered {business_data.name}"
        }],
        "created_at": now,
        "updated_at": now,
    })

    doc = businesses_collection.find_one({"_id": ObjectId(business_id)})
    formatted = format_doc(doc)
    formatted["product_count"] = 0
    formatted["views_count"] = 0
    return formatted


@router.get("/my", response_model=Optional[BusinessResponse])
def get_my_business(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    business = businesses_collection.find_one({"owner_id": user_id})
    if not business:
        return None

    formatted = format_doc(business)
    b_id = formatted["id"]
    formatted["product_count"] = products_collection.count_documents({"business_id": b_id})
    
    analytics = analytics_collection.find_one({"business_id": b_id})
    formatted["views_count"] = analytics.get("profile_views", 0) if analytics else 0
    return formatted


@router.get("/", response_model=List[BusinessResponse])
def list_and_search_businesses(
    search: Optional[str] = Query(None, description="Search by name, category, or description"),
    category: Optional[str] = Query(None, description="Filter by category"),
    city: Optional[str] = Query(None, description="Filter by city"),
    pin_code: Optional[str] = Query(None, description="Filter by PIN code"),
    limit: int = Query(50, ge=1, le=100),
):
    query = {}

    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"city": {"$regex": search, "$options": "i"}},
        ]

    if category and category.lower() != "all":
        query["category"] = {"$regex": f"^{category}$", "$options": "i"}

    if city:
        query["city"] = {"$regex": city, "$options": "i"}

    if pin_code:
        query["pin_code"] = {"$regex": f"^{pin_code}", "$options": "i"}

    cursor = businesses_collection.find(query).limit(limit)
    results = []

    for doc in cursor:
        formatted = format_doc(doc)
        b_id = formatted["id"]
        formatted["product_count"] = products_collection.count_documents({"business_id": b_id})
        analytics = analytics_collection.find_one({"business_id": b_id})
        formatted["views_count"] = analytics.get("profile_views", 0) if analytics else 0
        results.append(formatted)

    return results


@router.get("/{business_id}")
def get_business_details(business_id: str):
    try:
        oid = ObjectId(business_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid business ID format.")

    business = businesses_collection.find_one({"_id": oid})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found.")

    formatted = format_doc(business)
    # Fetch products
    prods_cursor = products_collection.find({"business_id": business_id})
    products = [format_doc(p) for p in prods_cursor]
    formatted["products"] = products
    formatted["product_count"] = len(products)

    analytics = analytics_collection.find_one({"business_id": business_id})
    formatted["views_count"] = analytics.get("profile_views", 0) if analytics else 0
    return formatted


@router.get("/{business_id}/public")
def get_public_business_webpage(business_id: str):
    """Public business website data endpoint. Increments view analytics."""
    try:
        oid = ObjectId(business_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid business ID format.")

    business = businesses_collection.find_one({"_id": oid})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found.")

    # Record actual recorded visit in analytics
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    analytics_collection.update_one(
        {"business_id": business_id},
        {
            "$inc": {"profile_views": 1},
            "$push": {
                "activity_log": {
                    "$each": [{
                        "action": "Profile Viewed",
                        "timestamp": now,
                        "details": "Public visitor viewed business webpage"
                    }],
                    "$slice": -50  # Keep latest 50 activities
                }
            },
            "$set": {"updated_at": now}
        },
        upsert=True,
    )

    formatted = format_doc(business)
    prods_cursor = products_collection.find({"business_id": business_id})
    products = [format_doc(p) for p in prods_cursor]
    formatted["products"] = products
    formatted["product_count"] = len(products)

    analytics = analytics_collection.find_one({"business_id": business_id})
    formatted["views_count"] = analytics.get("profile_views", 1) if analytics else 1
    return formatted


@router.put("/{business_id}", response_model=BusinessResponse)
def update_business(
    business_id: str,
    update_data: BusinessUpdate,
    current_user: dict = Depends(get_current_user),
):
    try:
        oid = ObjectId(business_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid business ID format.")

    business = businesses_collection.find_one({"_id": oid})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found.")

    # Verify ownership
    if business.get("owner_id") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to edit this business profile.")

    # Build update dict with provided fields only
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No valid fields provided for update.")

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    update_dict["updated_at"] = now

    businesses_collection.update_one({"_id": oid}, {"$set": update_dict})

    # Log activity
    analytics_collection.update_one(
        {"business_id": business_id},
        {
            "$push": {
                "activity_log": {
                    "$each": [{
                        "action": "Profile Updated",
                        "timestamp": now,
                        "details": f"Updated profile fields: {', '.join(update_dict.keys())}"
                    }],
                    "$slice": -50
                }
            }
        }
    )

    updated_doc = businesses_collection.find_one({"_id": oid})
    formatted = format_doc(updated_doc)
    formatted["product_count"] = products_collection.count_documents({"business_id": business_id})
    analytics = analytics_collection.find_one({"business_id": business_id})
    formatted["views_count"] = analytics.get("profile_views", 0) if analytics else 0
    return formatted


@router.delete("/{business_id}")
def delete_business(business_id: str, current_user: dict = Depends(get_current_user)):
    try:
        oid = ObjectId(business_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid business ID format.")

    business = businesses_collection.find_one({"_id": oid})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found.")

    if business.get("owner_id") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this business profile.")

    businesses_collection.delete_one({"_id": oid})
    products_collection.delete_many({"business_id": business_id})
    analytics_collection.delete_one({"business_id": business_id})

    return {"message": "Business profile and related data deleted successfully."}
