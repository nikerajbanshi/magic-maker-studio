"""
User Model for SoundSteps Authentication System
Handles user data structure and validation
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime
import uuid


class UserBase(BaseModel):
    """Base user model with common fields"""
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr


class UserCreate(UserBase):
    """User creation model with password"""
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    """User login model"""
    email_or_username: str
    password: str


class GuestCreate(BaseModel):
    """Guest user creation model"""
    name: Optional[str] = "Guest"


class UserInDB(UserBase):
    """User model as stored in database"""
    id: str
    hashed_password: str
    is_guest: bool = False
    created_at: str
    last_active: str
    progress: Dict[str, Any] = {}


class User(UserBase):
    """User model for API responses (no password)"""
    id: str
    is_guest: bool = False
    created_at: str
    last_active: str
    progress: Dict[str, Any] = {}


class Token(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: User


class TokenData(BaseModel):
    """JWT token payload data"""
    user_id: Optional[str] = None
    username: Optional[str] = None
    is_guest: bool = False
