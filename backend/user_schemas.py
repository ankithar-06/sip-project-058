import string
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional


def validate_strong_password(v: str) -> str:
    if len(v) < 8:
        raise ValueError("Password must be at least 8 characters long.")
    if not any(c.isupper() for c in v):
        raise ValueError("Password must contain at least one uppercase letter (A-Z).")
    if not any(c.islower() for c in v):
        raise ValueError("Password must contain at least one lowercase letter (a-z).")
    if not any(c.isdigit() for c in v):
        raise ValueError("Password must contain at least one number (0-9).")
    if not any(c in string.punctuation for c in v):
        raise ValueError("Password must contain at least one special character (!@#$%^&* etc.).")
    return v


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    role: Optional[str] = "msme_owner"

    @field_validator("password")
    @classmethod
    def check_password_strength(cls, v: str) -> str:
        return validate_strong_password(v)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=6, max_length=6)


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    reset_token: str = Field(min_length=20)
    new_password: str = Field(min_length=8, max_length=72)

    @field_validator("new_password")
    @classmethod
    def check_new_password_strength(cls, v: str) -> str:
        return validate_strong_password(v)


class MessageResponse(BaseModel):
    message: str
    reset_token: Optional[str] = None
