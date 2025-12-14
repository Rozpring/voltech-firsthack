from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select # SQLModel用に変更
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any

from app.db.session import get_db
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token # さっき作ったTokenスキーマ
from app.models.user import User
from app.core.security import get_password_hash, create_access_token, verify_password, get_current_user

router = APIRouter()

# ユーザー登録
@router.post("/", response_model=UserResponse)
def register_user(*, db: Session = Depends(get_db), user_in: UserCreate):
    # SQLModelスタイルの検索に変更
    statement = select(User).where(User.username == user_in.username)
    db_user = db.exec(statement).first()
    
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
        
    hashed_password = get_password_hash(user_in.password)
    
    # Userモデルの作成
    new_user = User(
        username=user_in.username,
        hashed_password=hashed_password,
        receive_reminders=True # デフォルト設定
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# ログイン (レスポンスモデルにTokenを指定)
@router.post("/login/", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    # SQLModelスタイルの検索
    statement = select(User).where(User.username == form_data.username)
    user = db.exec(statement).first()
    
    # ユーザーがいない or パスワード違い
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # IDをsubjectとしてトークン生成
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

# 自分の情報取得
@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user