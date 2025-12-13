# タグ/カテゴリ管理

from fastapi import APIRouter
router = APIRouter()


@router.get("/")
def read_categories():
    return [{"name": "Test Category"}]