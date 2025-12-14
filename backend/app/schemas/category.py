# カテゴリのスキーマ

from pydantic import BaseModel
from typing import Optional


class CategoryBase(BaseModel):
    name: str
    color: Optional[str] = "#6366f1"


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
