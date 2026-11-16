
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models import Business, Product

router = APIRouter(
    prefix="/api/products",
    tags=["Products"],
)


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    description: str | None = None
    price: float | None = Field(default=None, ge=0)
    category: str | None = None
    business_id: int = Field(gt=0)


class ProductResponse(ProductCreate):
    id: int

    model_config = {"from_attributes": True}


@router.post("/", response_model=ProductResponse, status_code=201)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
):
    business = (
        db.query(Business)
        .filter(Business.id == product_data.business_id)
        .first()
    )

    if not business:
        raise HTTPException(
            status_code=404,
            detail="Business not found. Register a business first.",
        )

    new_product = Product(**product_data.model_dump())

    db.add(new_product)

    try:
        db.commit()
        db.refresh(new_product)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not save product",
        )

    return new_product


@router.get("/", response_model=list[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()
