import os
import datetime
import bcrypt
import jwt
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv

from database import users_collection, businesses_collection, format_doc
from user_schemas import UserCreate, UserLogin, TokenResponse, UserResponse

load_dotenv()

router = APIRouter(prefix="/api/users", tags=["Users & Authentication"])

JWT_SECRET = os.getenv("JWT_SECRET", "msme_connect_ai_super_secret_jwt_key_2026_secure")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expire,
        "iat": datetime.datetime.now(datetime.timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_user(authorization: str = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Authentication token is missing or invalid. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload.")
        
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=401, detail="User account not found.")
        return format_doc(user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate credentials.")


@router.post("/register", response_model=TokenResponse, status_code=201)
def register_user(user_data: UserCreate):
    normalized_email = user_data.email.lower().strip()
    existing_user = users_collection.find_one({"email": normalized_email})
    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="An account with this email address already exists. Please log in.",
        )

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    new_user_doc = {
        "name": user_data.name.strip(),
        "email": normalized_email,
        "password_hash": hash_password(user_data.password),
        "role": user_data.role or "msme_owner",
        "created_at": now,
        "updated_at": now,
    }

    result = users_collection.insert_one(new_user_doc)
    user_id = str(result.inserted_id)

    token = create_access_token(user_id, normalized_email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user_data.name.strip(),
            "email": normalized_email,
            "role": user_data.role or "msme_owner",
        },
    }


@router.post("/login", response_model=TokenResponse)
def login_user(credentials: UserLogin):
    normalized_email = credentials.email.lower().strip()
    user = users_collection.find_one({"email": normalized_email})
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password. Please check your credentials.",
        )

    user_id = str(user["_id"])
    token = create_access_token(user_id, normalized_email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user.get("name", "MSME Owner"),
            "email": user["email"],
            "role": user.get("role", "msme_owner"),
        },
    }


@router.get("/me")
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    # Check if the user has created a business profile
    business = businesses_collection.find_one({"owner_id": user_id})
    return {
        "user": {
            "id": user_id,
            "name": current_user.get("name"),
            "email": current_user.get("email"),
            "role": current_user.get("role"),
            "created_at": current_user.get("created_at"),
        },
        "business": format_doc(business) if business else None,
    }


@router.post("/logout")
def logout_user():
    return {"message": "Logged out successfully"}
