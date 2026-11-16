
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Business, User
from schemas import BusinessCreate, BusinessResponse

router = APIRouter(
    prefix="/api/businesses",
    tags=["Businesses"],
)


@router.post("/", response_model=BusinessResponse, status_code=201)
def create_business(
    business_data: BusinessCreate,
    db: Session = Depends(get_db),
):
    # Confirm that the owner exists
    owner = (
        db.query(User)
        .filter(User.id == business_data.owner_id)
        .first()
    )

    if not owner:
        raise HTTPException(
            status_code=404,
            detail="User not found. Register the owner first.",
        )

    new_business = Business(
        name=business_data.name,
        category=business_data.category,
        description=business_data.description,
        location=business_data.location,
        contact_email=business_data.contact_email,
        phone=business_data.phone,
        owner_id=business_data.owner_id,
    )

    db.add(new_business)

    try:
        db.commit()
        db.refresh(new_business)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not save business",
        )

    return new_business


@router.get("/", response_model=list[BusinessResponse])
def list_businesses(db: Session = Depends(get_db)):
    return db.query(Business).all()
