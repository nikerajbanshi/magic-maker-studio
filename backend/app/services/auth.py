"""
Authentication Service
Handles user authentication, JWT tokens, and session management
"""

from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import uuid
import json
import os

from app.models.user import User, UserInDB, UserCreate, GuestCreate
from app.services.password import hash_password, verify_password

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production-please-use-strong-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# In-memory user storage (replace with database in production)
users_db: Dict[str, UserInDB] = {}
guest_counter = 0

# File-based persistence for demo
USERS_FILE = os.path.join(os.path.dirname(__file__), "../../data/users.json")


def load_users():
    """Load users from JSON file if it exists"""
    global users_db, guest_counter
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r') as f:
                data = json.load(f)
                users_db = {uid: UserInDB(**user_data) for uid, user_data in data.get('users', {}).items()}
                guest_counter = data.get('guest_counter', 0)
        except Exception as e:
            print(f"Error loading users: {e}")


def save_users():
    """Save users to JSON file for persistence"""
    try:
        os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
        with open(USERS_FILE, 'w') as f:
            data = {
                'users': {uid: user.dict() for uid, user in users_db.items()},
                'guest_counter': guest_counter
            }
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Error saving users: {e}")


# Load users on module import
load_users()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    
    Args:
        data: Data to encode in the token
        expires_delta: Optional expiration time delta
        
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify and decode a JWT token
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload or None if invalid
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def get_user_by_email(email: str) -> Optional[UserInDB]:
    """Find user by email"""
    for user in users_db.values():
        if user.email == email:
            return user
    return None


def get_user_by_username(username: str) -> Optional[UserInDB]:
    """Find user by username"""
    for user in users_db.values():
        if user.username == username:
            return user
    return None


def get_user_by_id(user_id: str) -> Optional[UserInDB]:
    """Find user by ID"""
    return users_db.get(user_id)


def register_user(user_create: UserCreate) -> Optional[User]:
    """
    Register a new user
    
    Args:
        user_create: User creation data
        
    Returns:
        Created user object or None if registration fails
    """
    # Check if user already exists
    if get_user_by_email(user_create.email):
        return None
    if get_user_by_username(user_create.username):
        return None
    
    # Create new user
    user_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    user_in_db = UserInDB(
        id=user_id,
        username=user_create.username,
        email=user_create.email,
        hashed_password=hash_password(user_create.password),
        is_guest=False,
        created_at=now,
        last_active=now,
        progress={
            "flashcards_completed": [],
            "soundout_completed": 0,
            "games_completed": 0,
            "minimal_pairs_completed": 0,
            "total_time_spent": 0,
            "current_streak": 0
        }
    )
    
    users_db[user_id] = user_in_db
    save_users()
    
    # Return user without password
    return User(
        id=user_in_db.id,
        username=user_in_db.username,
        email=user_in_db.email,
        is_guest=False,
        created_at=user_in_db.created_at,
        last_active=user_in_db.last_active,
        progress=user_in_db.progress
    )


def authenticate_user(email_or_username: str, password: str) -> Optional[User]:
    """
    Authenticate a user with email/username and password
    
    Args:
        email_or_username: User's email or username
        password: Plain text password
        
    Returns:
        User object if authentication successful, None otherwise
    """
    # Try to find user by email or username
    user = get_user_by_email(email_or_username)
    if not user:
        user = get_user_by_username(email_or_username)
    
    if not user:
        return None
    
    # Verify password
    if not verify_password(password, user.hashed_password):
        return None
    
    # Update last active time
    user.last_active = datetime.utcnow().isoformat()
    save_users()
    
    # Return user without password
    return User(
        id=user.id,
        username=user.username,
        email=user.email,
        is_guest=False,
        created_at=user.created_at,
        last_active=user.last_active,
        progress=user.progress
    )


def create_guest_user(name: Optional[str] = None) -> User:
    """
    Create a guest user with auto-incremented ID
    
    Args:
        name: Optional guest name
        
    Returns:
        Created guest user object
    """
    global guest_counter
    guest_counter += 1
    guest_id = f"guest_{guest_counter:05d}"
    
    now = datetime.utcnow().isoformat()
    display_name = name if name else f"Guest_{guest_counter:05d}"
    
    guest_user = UserInDB(
        id=guest_id,
        username=display_name,
        email=f"{guest_id}@guest.soundsteps.app",  # Placeholder email for guest
        hashed_password="",  # No password for guests
        is_guest=True,
        created_at=now,
        last_active=now,
        progress={
            "flashcards_completed": [],
            "soundout_completed": 0,
            "games_completed": 0,
            "minimal_pairs_completed": 0,
            "total_time_spent": 0,
            "current_streak": 0
        }
    )
    
    users_db[guest_id] = guest_user
    save_users()
    
    return User(
        id=guest_user.id,
        username=guest_user.username,
        email=guest_user.email,
        is_guest=True,
        created_at=guest_user.created_at,
        last_active=guest_user.last_active,
        progress=guest_user.progress
    )


def update_user_progress(user_id: str, progress_update: Dict[str, Any]) -> bool:
    """
    Update user progress data
    
    Args:
        user_id: User ID
        progress_update: Dictionary of progress updates
        
    Returns:
        True if update successful, False otherwise
    """
    user = users_db.get(user_id)
    if not user:
        return False
    
    user.progress.update(progress_update)
    user.last_active = datetime.utcnow().isoformat()
    save_users()
    return True
