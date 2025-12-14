# タグ/カテゴリ管理

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.category import Category
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.api.v1.endpoints.users import get_current_user

router = APIRouter()

# デフォルトカテゴリの定義
DEFAULT_CATEGORIES = [
    {"name": "家事", "color": "#10B981"},    # グリーン
    {"name": "仕事", "color": "#3B82F6"},    # ブルー
    {"name": "課題", "color": "#F59E0B"},    # オレンジ
]


@router.get("/", response_model=List[CategoryResponse])
def read_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """ユーザーのカテゴリ一覧を取得"""
    categories = db.query(Category).filter(Category.user_id == current_user.id).all()
    return categories


@router.post("/", response_model=CategoryResponse)
def create_category(
    *,
    db: Session = Depends(get_db),
    category_in: CategoryCreate,
    current_user: User = Depends(get_current_user)
):
    """新しいカテゴリを作成"""
    db_category = Category(
        name=category_in.name,
        color=category_in.color,
        user_id=current_user.id
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.post("/init", response_model=List[CategoryResponse])
def initialize_default_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """デフォルトカテゴリ（家事、仕事、課題）を初期化"""
    # 既存のカテゴリをチェック
    existing = db.query(Category).filter(Category.user_id == current_user.id).all()
    existing_names = [cat.name for cat in existing]
    
    created_categories = []
    for default_cat in DEFAULT_CATEGORIES:
        if default_cat["name"] not in existing_names:
            db_category = Category(
                name=default_cat["name"],
                color=default_cat["color"],
                user_id=current_user.id
            )
            db.add(db_category)
            created_categories.append(db_category)
    
    if created_categories:
        db.commit()
        for cat in created_categories:
            db.refresh(cat)
    
    # すべてのカテゴリを返す
    return db.query(Category).filter(Category.user_id == current_user.id).all()


@router.get("/{category_id}", response_model=CategoryResponse)
def read_category(
    *,
    db: Session = Depends(get_db),
    category_id: int,
    current_user: User = Depends(get_current_user)
):
    """特定のカテゴリを取得"""
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    *,
    db: Session = Depends(get_db),
    category_id: int,
    category_in: CategoryUpdate,
    current_user: User = Depends(get_current_user)
):
    """カテゴリを更新"""
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)
    
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}")
def delete_category(
    *,
    db: Session = Depends(get_db),
    category_id: int,
    current_user: User = Depends(get_current_user)
):
    """カテゴリを削除"""
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(category)
    db.commit()
    return {"message": "Category deleted"}