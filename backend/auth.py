import os
import datetime
import secrets
import hashlib
import smtplib
from email.message import EmailMessage
import bcrypt
import jwt
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv

from database import (
    users_collection,
    businesses_collection,
    password_resets_collection,
    format_doc,
)
from user_schemas import (
    UserCreate,
    UserLogin,
    TokenResponse,
    UserResponse,
    ForgotPasswordRequest,
    VerifyOtpRequest,
    ResetPasswordRequest,
    MessageResponse,
)

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


def hash_otp(email: str, otp: str) -> str:
    """Securely hash the OTP combined with email and server secret."""
    combined = f"{email.lower().strip()}:{otp.strip()}:{JWT_SECRET}"
    return hashlib.sha256(combined.encode("utf-8")).hexdigest()


def hash_token(token: str) -> str:
    """Securely hash the temporary password reset token."""
    combined = f"{token.strip()}:{JWT_SECRET}"
    return hashlib.sha256(combined.encode("utf-8")).hexdigest()


def send_otp_email(to_email: str, otp: str) -> bool:
    """
    Sends the 6-digit OTP to the registered user's email via SMTP if configured.
    Falls back gracefully to development console logging when SMTP credentials are absent.
    """
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from = os.getenv("SMTP_FROM", smtp_user or "noreply@msmeconnect.in")

    if smtp_host and smtp_user and smtp_password:
        try:
            msg = EmailMessage()
            msg["Subject"] = f"{otp} is your MSME Connect AI Verification Code"
            msg["From"] = f"MSME Connect AI <{smtp_from}>"
            msg["To"] = to_email

            plain_text = f"""Hello,

You requested a password reset for your MSME Connect AI account.

Your 6-digit verification code is: {otp}

This verification code will expire in 10 minutes. If you did not make this request, please ignore this email.

Best regards,
MSME Connect AI Security Team
"""
            html_content = f"""
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="color: #0f172a; margin: 0; font-size: 22px;">MSME Connect AI</h2>
                    <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Empowering Informal Enterprises</p>
                </div>
                <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <h3 style="color: #1e293b; margin-top: 0; font-size: 16px;">Password Reset Verification Code</h3>
                    <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 8px 0 20px 0;">
                        Use the single-use 6-digit verification code below to verify your account and reset your password:
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #2563eb; background: #eff6ff; padding: 12px 24px; border-radius: 10px; border: 1px dashed #93c5fd; display: inline-block;">
                            {otp}
                        </span>
                    </div>
                    <p style="color: #64748b; font-size: 12px; margin: 16px 0 0 0; line-height: 1.4;">
                        ⏱️ This verification code is valid for <strong>10 minutes</strong>. Never share this code with anyone.
                    </p>
                </div>
            </div>
            """
            msg.set_content(plain_text)
            msg.add_alternative(html_content, subtype="html")

            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.send_message(msg)

            print(f"[AUTH EMAIL] Successfully delivered OTP email to {to_email}")
            return True
        except Exception as e:
            print(f"[AUTH EMAIL WARNING] Failed to send email via SMTP to {to_email}: {e}")
            return False
    else:
        # Development / test fallback logging
        print(f"[DEVELOPMENT NOTICE] SMTP not configured. Password reset verification code for {to_email} is: {otp}")
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


# ==========================================
# FEATURE 2: FORGOT PASSWORD ENDPOINTS
# ==========================================

@router.post("/forgot-password", response_model=MessageResponse)
def request_password_reset(payload: ForgotPasswordRequest):
    """
    Step 1 & 2: Rate-limited password reset request.
    Generates a secure 6-digit OTP and delivers via email if user exists.
    Returns a generic message to prevent email enumeration.
    """
    normalized_email = payload.email.lower().strip()
    now = datetime.datetime.now(datetime.timezone.utc)

    # Rate limiting: Max 3 requests in the last 15 minutes per email
    fifteen_mins_ago = (now - datetime.timedelta(minutes=15)).isoformat()
    recent_requests_count = password_resets_collection.count_documents({
        "email": normalized_email,
        "created_at": {"$gte": fifteen_mins_ago},
    })
    if recent_requests_count >= 3:
        raise HTTPException(
            status_code=429,
            detail="Too many password reset attempts. Please wait 15 minutes before requesting another code.",
        )

    # Check if the user exists
    user = users_collection.find_one({"email": normalized_email})
    if user:
        # Invalidate any previously active unused reset codes for this email
        password_resets_collection.update_many(
            {"email": normalized_email, "used": False},
            {"$set": {"used": True, "invalidated_at": now.isoformat()}},
        )

        # Generate cryptographically secure 6-digit OTP
        otp = f"{secrets.SystemRandom().randint(100000, 999999)}"
        hashed_otp = hash_otp(normalized_email, otp)
        expires_at = (now + datetime.timedelta(minutes=10)).isoformat()

        reset_record = {
            "email": normalized_email,
            "otp_hash": hashed_otp,
            "attempts": 0,
            "used": False,
            "otp_verified": False,
            "reset_token_hash": None,
            "expires_at": expires_at,
            "created_at": now.isoformat(),
        }
        password_resets_collection.insert_one(reset_record)

        # Dispatch verification code via configured email service
        send_otp_email(normalized_email, otp)

    # Return safe, generic confirmation message to prevent user enumeration
    return {
        "message": "If this email is registered with MSME Connect AI, a 6-digit verification code has been sent. Please check your inbox.",
    }


@router.post("/verify-otp", response_model=MessageResponse)
def verify_password_reset_otp(payload: VerifyOtpRequest):
    """
    Step 3: Verifies the 6-digit OTP with strict attempt limits and expiry.
    On success, generates a temporary, single-use reset token for Step 4.
    """
    normalized_email = payload.email.lower().strip()
    provided_otp = payload.otp.strip()
    now = datetime.datetime.now(datetime.timezone.utc)

    # Find the latest unused reset request for this email
    record = password_resets_collection.find_one(
        {"email": normalized_email, "used": False},
        sort=[("created_at", -1)],
    )

    if not record:
        raise HTTPException(
            status_code=400,
            detail="No active password reset request found. Please request a new code.",
        )

    # Check expiration
    expires_at = datetime.datetime.fromisoformat(record["expires_at"])
    if now > expires_at:
        password_resets_collection.update_one(
            {"_id": record["_id"]},
            {"$set": {"used": True, "reason": "expired"}},
        )
        raise HTTPException(
            status_code=400,
            detail="This verification code has expired (valid for 10 minutes). Please request a new code.",
        )

    # Check attempt limit (max 5 attempts)
    current_attempts = record.get("attempts", 0)
    if current_attempts >= 5:
        password_resets_collection.update_one(
            {"_id": record["_id"]},
            {"$set": {"used": True, "reason": "max_attempts_exceeded"}},
        )
        raise HTTPException(
            status_code=429,
            detail="Too many incorrect attempts. This code has been invalidated for security. Please request a new code.",
        )

    # Verify OTP hash
    expected_hash = record["otp_hash"]
    actual_hash = hash_otp(normalized_email, provided_otp)

    if not secrets.compare_digest(actual_hash, expected_hash):
        new_attempts = current_attempts + 1
        password_resets_collection.update_one(
            {"_id": record["_id"]},
            {"$set": {"attempts": new_attempts}},
        )
        remaining = 5 - new_attempts
        raise HTTPException(
            status_code=400,
            detail=f"Invalid verification code. {remaining} attempt{'s' if remaining != 1 else ''} remaining.",
        )

    # OTP is valid: Generate a secure single-use reset token valid for 15 minutes
    reset_token = secrets.token_urlsafe(32)
    token_hash = hash_token(reset_token)
    token_expires_at = (now + datetime.timedelta(minutes=15)).isoformat()

    password_resets_collection.update_one(
        {"_id": record["_id"]},
        {
            "$set": {
                "otp_verified": True,
                "reset_token_hash": token_hash,
                "token_expires_at": token_expires_at,
            }
        },
    )

    return {
        "message": "Verification code verified successfully.",
        "reset_token": reset_token,
    }


@router.post("/reset-password", response_model=MessageResponse)
def complete_password_reset(payload: ResetPasswordRequest):
    """
    Step 4: Sets a new secure password after validating token and password strength.
    Invalidates all outstanding reset tokens and hashes password with bcrypt.
    """
    normalized_email = payload.email.lower().strip()
    now = datetime.datetime.now(datetime.timezone.utc)

    # Find verified, unused reset record for this email
    record = password_resets_collection.find_one(
        {
            "email": normalized_email,
            "used": False,
            "otp_verified": True,
        },
        sort=[("created_at", -1)],
    )

    if not record or not record.get("reset_token_hash"):
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired password reset session. Please start the reset process again.",
        )

    # Verify reset token expiration
    token_expires_at = datetime.datetime.fromisoformat(record["token_expires_at"])
    if now > token_expires_at:
        password_resets_collection.update_one(
            {"_id": record["_id"]},
            {"$set": {"used": True, "reason": "token_expired"}},
        )
        raise HTTPException(
            status_code=400,
            detail="Your reset session has expired (15 minute limit). Please request a new verification code.",
        )

    # Verify reset token securely using constant-time comparison
    expected_token_hash = record["reset_token_hash"]
    actual_token_hash = hash_token(payload.reset_token)
    if not secrets.compare_digest(actual_token_hash, expected_token_hash):
        raise HTTPException(
            status_code=400,
            detail="Invalid password reset token.",
        )

    # Hash new password with bcrypt
    new_password_hash = hash_password(payload.new_password)

    # Update user document in MongoDB
    update_res = users_collection.update_one(
        {"email": normalized_email},
        {
            "$set": {
                "password_hash": new_password_hash,
                "updated_at": now.isoformat(),
            }
        },
    )

    if update_res.matched_count == 0:
        raise HTTPException(status_code=404, detail="User account not found.")

    # Invalidate all reset records for this email (prevent token reuse)
    password_resets_collection.update_many(
        {"email": normalized_email},
        {"$set": {"used": True, "completed_at": now.isoformat()}},
    )

    return {
        "message": "Password has been reset successfully. You can now log in with your new password.",
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
