from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# --- モデル、設定、ルーターのインポート ---
from app.api.v1.api import api_router
from app.core.config import settings
from app.db.base import Base
# テーブル作成のために、定義したモデルをインポートする
from app.models import user, task, category

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- アプリケーション起動時の処理 ---
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    
    # テーブル作成 (存在しない場合のみ)
    # lifespan内で実行することで、メインプロセスで一度だけ安全に実行される
    Base.metadata.create_all(bind=engine)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    app.state.SessionLocal = SessionLocal
    
    yield
    # --- アプリケーション終了時の処理 ---
    # (現時点では特に無し)

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# CORS設定：Reactフロントエンドからアクセスできるようにする
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}"}
