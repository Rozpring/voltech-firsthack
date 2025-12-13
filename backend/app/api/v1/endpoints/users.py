# 認証/ユーザー管理

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.db.session import get_db
from app.schemas.user import UserCreate, UserResponse
from app.models.user import User
from app.core.security import get_password_hash, create_access_token, verify_password, get_current_user

router = APIRouter()

# ユーザー認証の依存性関数 (詳細ロジックは security.py に依存)
# JWTを使ってトークンからユーザーを特定するロジックが必要
# ... (get_current_user関数の定義は省略)

## ユーザー登録 (POST /users/)
@router.post("/", response_model=UserResponse)
def register_user(*, db: Session = Depends(get_db), user_in: UserCreate):
    # ユーザー名の重複チェック
    db_user = db.query(User).filter(User.username == user_in.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
        
    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        username=user_in.username,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

## ログイン (POST /login/)
@router.post("/login/")
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

## 自分の情報取得 (GET /users/me)
@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)): # 認証保護
    return current_user