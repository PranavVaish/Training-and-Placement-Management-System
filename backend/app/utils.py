from fastapi import HTTPException
import secrets
import jwt
import os
import datetime


SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")  # Use an environment variable for the secret key
ALGORITHM = "HS256"  # Algorithm for JWT

def verify_token(token: str):
    """
    Verify the JWT token and extract the user ID.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")  # Assuming "sub" claim contains the user ID
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
def create_access_token(data: dict, expires_delta: datetime.timedelta | None = None):
    """
    Generate a JWT token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def generate_refresh_token():
    """
    Generate a secure refresh token.
    """
    return secrets.token_urlsafe(32)