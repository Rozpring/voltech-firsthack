# パスワードハッシュ、JWT関連
from datetime import datetime, timedelta
from typing import Any, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import bcrypt
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.token import TokenData


# 設定（環境変数から取得することが望ましい）
SECRET_KEY = "YOUR_SUPER_SECRET_KEY" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1週間

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login/")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """平文パスワードとハッシュを比較"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    """パスワードをハッシュ化"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(subject: str | Any) -> str:
    """JWTアクセストークンを生成"""
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=int(user_id))
    except (JWTError, ValueError):
        raise credentials_exception
    user = db.query(User).filter(User.id == token_data.user_id).first()
    if user is None:
        raise credentials_exception
    return user