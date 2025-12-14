# アプリケーションのエントリーポイント
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# 環境変数をロード (CORS設定などに使用)
load_dotenv()

# DBモデルのインポート
from app.db.base import Base
from app.models import user, task, category, location
from app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- アプリケーション起動時の処理 ---
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    
    # テーブル作成 (存在しない場合のみ)
    Base.metadata.create_all(bind=engine)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    app.state.SessionLocal = SessionLocal
    
    yield
    # --- アプリケーション終了時の処理 ---

app = FastAPI(title="TaskMaster-Backend", lifespan=lifespan)

# CORS設定：Reactからアクセスできるようにする
# 開発中はReactの実行URL (通常は http://localhost:5173 または http://localhost:3000) を許可します。
origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
    "http://localhost:3000",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルートエンドポイント
@app.get("/")
def read_root():
    return {"message": "FastAPI Backend is running! (TaskMaster)"}

# APIルーターをインクルード
from app.api.v1.api import api_router
app.include_router(api_router, prefix="/api/v1")