from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any


# ==========================================
# Business Schemas
# ==========================================
class BusinessCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    owner_name: Optional[str] = None
    category: str = Field(min_length=2, max_length=100)
    description: Optional[str] = None
    location: str = Field(min_length=2, max_length=300)
    city: str = Field(min_length=2, max_length=100)
    pin_code: str = Field(min_length=3, max_length=20)
    contact_email: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    operating_hours: Optional[str] = "9:00 AM - 7:00 PM"


class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    owner_name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    pin_code: Optional[str] = None
    contact_email: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    operating_hours: Optional[str] = None


class BusinessResponse(BaseModel):
    id: str
    owner_id: str
    name: str
    owner_name: Optional[str] = None
    category: str
    description: Optional[str] = None
    location: str
    city: str
    pin_code: str
    contact_email: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    operating_hours: Optional[str] = None
    created_at: Optional[str] = None
    product_count: Optional[int] = 0
    views_count: Optional[int] = 0


# ==========================================
# Product Schemas
# ==========================================
class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    description: Optional[str] = None
    price: float = Field(ge=0)
    category: Optional[str] = None
    in_stock: Optional[bool] = True
    image_url: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, ge=0)
    category: Optional[str] = None
    in_stock: Optional[bool] = None
    image_url: Optional[str] = None


class ProductResponse(BaseModel):
    id: str
    business_id: str
    name: str
    description: Optional[str] = None
    price: float
    category: Optional[str] = None
    in_stock: bool = True
    image_url: Optional[str] = None
    created_at: Optional[str] = None


# ==========================================
# Collaboration Schemas
# ==========================================
class CollaborationCreate(BaseModel):
    receiver_business_id: str
    purpose: str = Field(min_length=3, max_length=150)
    message: str = Field(min_length=10, max_length=1000)
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None


class CollaborationStatusUpdate(BaseModel):
    status: str = Field(pattern="^(accepted|rejected)$")


# ==========================================
# Marketing Content Schemas
# ==========================================
class MarketingGenerateRequest(BaseModel):
    product_name: str = Field(min_length=2, max_length=200)
    product_description: str = Field(min_length=5, max_length=1000)
    target_audience: str = Field(min_length=2, max_length=200)
    marketing_objective: str = Field(default="Brand Awareness & Direct Sales")
    tone: Optional[str] = "Professional and persuasive"


class MarketingContentResponse(BaseModel):
    id: Optional[str] = None
    business_id: Optional[str] = None
    product_name: str
    captions: List[str]
    slogans: List[str]
    promotional_messages: List[str]
    hashtags: List[str]
    ad_copy: Dict[str, str]
    created_at: Optional[str] = None
