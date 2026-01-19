"""
Authentication Middleware
Handles JWT token verification and route protection
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

from app.services.auth import verify_token, get_user_by_id
from app.models.user import User

# Security scheme for JWT bearer token
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    """
    Dependency to get current authenticated user from JWT token
    
    Args:
        credentials: HTTP Bearer token from Authorization header
        
    Returns:
        Current user object
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Verify token
    payload = verify_token(credentials.credentials)
    if payload is None:
        raise credentials_exception
    
    # Extract user ID from token
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    # Get user from database
    user_in_db = get_user_by_id(user_id)
    if user_in_db is None:
        raise credentials_exception
    
    # Return user without password
    return User(
        id=user_in_db.id,
        username=user_in_db.username,
        email=user_in_db.email,
        is_guest=user_in_db.is_guest,
        created_at=user_in_db.created_at,
        last_active=user_in_db.last_active,
        progress=user_in_db.progress
    )


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to get current active user (can be extended with active status check)
    
    Args:
        current_user: Current user from get_current_user
        
    Returns:
        Current active user object
    """
    # Add additional checks here if needed (e.g., user.is_active)
    return current_user


async def get_current_registered_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to ensure current user is a registered user (not guest)
    
    Args:
        current_user: Current user from get_current_user
        
    Returns:
        Current registered user object
        
    Raises:
        HTTPException: If user is a guest
    """
    if current_user.is_guest:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This feature requires a registered account"
        )
    return current_user


# Optional token (for endpoints that work with or without auth)
class OptionalHTTPBearer(HTTPBearer):
    async def __call__(self, request):
        try:
            return await super().__call__(request)
        except HTTPException:
            return None


optional_security = OptionalHTTPBearer()


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_security)
) -> Optional[User]:
    """
    Dependency to optionally get current user (returns None if not authenticated)
    
    Args:
        credentials: Optional HTTP Bearer token
        
    Returns:
        Current user object or None if not authenticated
    """
    if credentials is None:
        return None
    
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None
