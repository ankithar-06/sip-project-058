import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List

from database import (
    products_collection,
    businesses_collection,
    analytics_collection,
    format_doc,
)
from auth import get_current_user
from schemas import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.post("/", response_model=ProductResponse, status_code=201)
def add_product(
    product_data: ProductCreate,
    current_user: dict = Depends(get_current_user),
):
    # Find user's business
    business = businesses_collection.find_one({"owner_id": current_user["id"]})
    if not business:
        raise HTTPException(
            status_code=400,
            detail="You must create a business profile before adding products.",
        )

    business_id = str(business["_id"])
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()

    product_doc = {
        "business_id": business_id,
        "name": product_data.name.strip(),
        "description": product_data.description or "",
        "price": float(product_data.price),
        "category": product_data.category or business.get("category", "General"),
        "in_stock": product_data.in_stock if product_data.in_stock is not None else True,
        "image_url": product_data.image_url or "",
        "created_at": now,
        "updated_at": now,
    }

    result = products_collection.insert_one(product_doc)
    product_id = str(result.inserted_id)

    # Log activity in analytics
    analytics_collection.update_one(
        {"business_id": business_id},
        {
            "$push": {
                "activity_log": {
                    "$each": [{
                        "action": "Product Added",
                        "timestamp": now,
                        "details": f"Added product '{product_data.name}' (₹{product_data.price})"
                    }],
                    "$slice": -50
                }
            }
        }
    )

    doc = products_collection.find_one({"_id": ObjectId(product_id)})
    return format_doc(doc)


@router.get("/", response_model=List[ProductResponse])
def list_products(
    business_id: Optional[str] = Query(None, description="Filter by business ID"),
    category: Optional[str] = Query(None, description="Filter by product category"),
    search: Optional[str] = Query(None, description="Search product name or description"),
):
    query = {}
    if business_id:
        query["business_id"] = business_id
    if category and category.lower() != "all":
        query["category"] = {"$regex": f"^{category}$", "$options": "i"}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]

    cursor = products_collection.find(query).sort("created_at", -1)
    return [format_doc(doc) for doc in cursor]


@router.get("/my", response_model=List[ProductResponse])
def get_my_products(current_user: dict = Depends(get_current_user)):
    business = businesses_collection.find_one({"owner_id": current_user["id"]})
    if not business:
        return []

    business_id = str(business["_id"])
    cursor = products_collection.find({"business_id": business_id}).sort("created_at", -1)
    return [format_doc(doc) for doc in cursor]


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str):
    try:
        oid = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID format.")

    doc = products_collection.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found.")
    return format_doc(doc)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    update_data: ProductUpdate,
    current_user: dict = Depends(get_current_user),
):
    try:
        oid = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID format.")

    doc = products_collection.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found.")

    # Verify user owns the business associated with this product
    business = businesses_collection.find_one({"_id": ObjectId(doc["business_id"])})
    if not business or business.get("owner_id") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to edit this product.")

    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No valid fields provided for update.")

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    update_dict["updated_at"] = now

    products_collection.update_one({"_id": oid}, {"$set": update_dict})
    updated = products_collection.find_one({"_id": oid})
    return format_doc(updated)


@router.delete("/{product_id}")
def delete_product(product_id: str, current_user: dict = Depends(get_current_user)):
    try:
        oid = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID format.")

    doc = products_collection.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found.")

    business = businesses_collection.find_one({"_id": ObjectId(doc["business_id"])})
    if not business or business.get("owner_id") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this product.")

    products_collection.delete_one({"_id": oid})
    return {"message": f"Product '{doc.get('name')}' deleted successfully."}
