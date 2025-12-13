# v1ルーターのインクルード

from fastapi import APIRouter
from app.api.v1.endpoints import users, tasks #, categories # categoriesは別途作成

api_router = APIRouter()
api_router.include_router(users.router, tags=["users"], prefix="/users")
api_router.include_router(tasks.router, tags=["tasks"], prefix="/tasks")
api_router.include_router(categories.router, tags=["categories"], prefix="/categories")
api_router.include_router(locations.router, tags=["locations"], prefix="/locations")