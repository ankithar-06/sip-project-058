import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from typing import List

from database import (
    collaborations_collection,
    businesses_collection,
    analytics_collection,
    format_doc,
)
from auth import get_current_user
from schemas import CollaborationCreate, CollaborationStatusUpdate

router = APIRouter(prefix="/api/collaborations", tags=["Collaboration Network"])


@router.post("/", status_code=201)
def send_collaboration_request(
    data: CollaborationCreate,
    current_user: dict = Depends(get_current_user),
):
    # Sender must have a business profile
    sender_biz = businesses_collection.find_one({"owner_id": current_user["id"]})
    if not sender_biz:
        raise HTTPException(
            status_code=400,
            detail="You need a business profile to send collaboration requests.",
        )

    sender_biz_id = str(sender_biz["_id"])
    if sender_biz_id == data.receiver_business_id:
        raise HTTPException(
            status_code=400,
            detail="You cannot send a collaboration request to your own business.",
        )

    try:
        recv_oid = ObjectId(data.receiver_business_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid receiver business ID.")

    receiver_biz = businesses_collection.find_one({"_id": recv_oid})
    if not receiver_biz:
        raise HTTPException(status_code=404, detail="Target business not found.")

    # Check for existing pending request
    existing = collaborations_collection.find_one({
        "sender_business_id": sender_biz_id,
        "receiver_business_id": data.receiver_business_id,
        "status": "pending",
    })
    if existing:
        raise HTTPException(
            status_code=409,
            detail="A pending collaboration request to this business already exists.",
        )

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    collab_doc = {
        "sender_business_id": sender_biz_id,
        "sender_business_name": sender_biz.get("name", "Unknown Business"),
        "sender_category": sender_biz.get("category", "General"),
        "sender_city": sender_biz.get("city", ""),
        "receiver_business_id": data.receiver_business_id,
        "receiver_business_name": receiver_biz.get("name", "Partner Business"),
        "purpose": data.purpose.strip(),
        "message": data.message.strip(),
        "contact_email": str(data.contact_email) if data.contact_email else sender_biz.get("contact_email"),
        "contact_phone": data.contact_phone or sender_biz.get("phone"),
        "status": "pending",  # pending, accepted, rejected
        "created_at": now,
        "updated_at": now,
    }

    result = collaborations_collection.insert_one(collab_doc)

    # Update analytics for receiver business (they received a collaboration request)
    analytics_collection.update_one(
        {"business_id": data.receiver_business_id},
        {
            "$inc": {"collaboration_requests": 1},
            "$push": {
                "activity_log": {
                    "$each": [{
                        "action": "Collaboration Received",
                        "timestamp": now,
                        "details": f"Request from {sender_biz.get('name')} for {data.purpose}"
                    }],
                    "$slice": -50
                }
            }
        },
        upsert=True,
    )

    doc = collaborations_collection.find_one({"_id": result.inserted_id})
    return format_doc(doc)


@router.get("/")
def get_my_collaborations(current_user: dict = Depends(get_current_user)):
    biz = businesses_collection.find_one({"owner_id": current_user["id"]})
    if not biz:
        return {"received": [], "sent": []}

    biz_id = str(biz["_id"])

    received_cursor = collaborations_collection.find({"receiver_business_id": biz_id}).sort("created_at", -1)
    sent_cursor = collaborations_collection.find({"sender_business_id": biz_id}).sort("created_at", -1)

    return {
        "received": [format_doc(d) for d in received_cursor],
        "sent": [format_doc(d) for d in sent_cursor],
    }


@router.patch("/{collab_id}/status")
def update_collaboration_status(
    collab_id: str,
    status_update: CollaborationStatusUpdate,
    current_user: dict = Depends(get_current_user),
):
    try:
        oid = ObjectId(collab_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid collaboration ID.")

    collab = collaborations_collection.find_one({"_id": oid})
    if not collab:
        raise HTTPException(status_code=404, detail="Collaboration request not found.")

    biz = businesses_collection.find_one({"owner_id": current_user["id"]})
    if not biz or str(biz["_id"]) != collab["receiver_business_id"]:
        raise HTTPException(
            status_code=403,
            detail="Only the receiving business can respond to this collaboration request.",
        )

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    new_status = status_update.status

    collaborations_collection.update_one(
        {"_id": oid},
        {"$set": {"status": new_status, "updated_at": now}}
    )

    # Log in analytics
    analytics_collection.update_one(
        {"business_id": collab["receiver_business_id"]},
        {
            "$push": {
                "activity_log": {
                    "$each": [{
                        "action": f"Collaboration {new_status.capitalize()}",
                        "timestamp": now,
                        "details": f"Responded to {collab.get('sender_business_name')}"
                    }],
                    "$slice": -50
                }
            }
        }
    )

    updated = collaborations_collection.find_one({"_id": oid})
    return format_doc(updated)
