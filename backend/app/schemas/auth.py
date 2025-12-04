from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime

from app.models.user import UserRole, UserStatus

class Token(BaseModel):
    """JWT Token response schema"""
    access_token: str
    token_type: str
    expires_in: int
    user: Optional[dict] = None

class UserLogin(BaseModel):
    """User login schema"""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)

class UserCreate(BaseModel):
    """User creation schema"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2, max_length=100)
    phone_number: Optional[str] = Field(None, max_length=20)
    department: Optional[str] = Field(None, max_length=100)
    badge_number: Optional[str] = Field(None, max_length=50)
    role: Optional[UserRole] = UserRole.VIEWER
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v

class UserProfile(BaseModel):
    """User profile response schema"""
    id: str
    username: str
    email: str
    full_name: str
    phone_number: Optional[str] = None
    department: Optional[str] = None
    badge_number: Optional[str] = None
    role: str
    status: str
    is_verified: bool
    timezone: str
    language: str
    last_login: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True