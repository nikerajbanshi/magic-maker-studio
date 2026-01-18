"""
Authentication Routes
Handles user registration, login, and guest access
"""

from fastapi import APIRouter, HTTPException, status
from datetime import timedelta

from app.models.user import UserCreate, UserLogin, GuestCreate, Token, User
from app.services.auth import (
    register_user,
    authenticate_user,
    create_guest_user,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()


@router.post("/register", response_model=Token, summary="Register a new user")
async def register(user_data: UserCreate):
    """
    Register a new user account
    
    - **username**: 3-20 characters, unique
    - **email**: Valid email address, unique
    - **password**: Minimum 8 characters
    
    Returns JWT token and user data
    """
    user = register_user(user_data)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already exists"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id, "username": user.username, "is_guest": False},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        user=user
    )


@router.post("/login", response_model=Token, summary="User login")
async def login(credentials: UserLogin):
    """
    Authenticate user with email/username and password
    
    - **email_or_username**: User's email or username
    - **password**: User's password
    
    Returns JWT token and user data
    """
    user = authenticate_user(credentials.email_or_username, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id, "username": user.username, "is_guest": False},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        user=user
    )


@router.post("/guest", response_model=Token, summary="Create guest session")
async def guest_login(guest_data: GuestCreate):
    """
    Create a guest user session without registration
    
    - **name**: Optional guest name (defaults to "Guest")
    
    Guest users are assigned auto-incremented IDs (guest_00001, guest_00002, etc.)
    and have the same app access as registered users but no data persistence.
    
    Returns JWT token and guest user data
    """
    user = create_guest_user(guest_data.name)
    
    # Create access token for guest
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id, "username": user.username, "is_guest": True},
        expires_delta=access_token_expires
    )
    
    return Token(
        access_token=access_token,
        user=user
    )


@router.post("/logout", summary="User logout")
async def logout():
    """
    Logout user (client should remove token)
    
    Returns success message
    """
    return {
        "message": "Logged out successfully",
        "action": "Client should clear authentication token"
    }
