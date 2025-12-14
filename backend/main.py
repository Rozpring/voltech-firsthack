from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel # 追加
from app.db.session import engine # 追加
from app.api.v1.api import api_router # 追加: ルーターの集約ファイル
from app.core.config import settings # 設定ファイルがある場合

# DBテーブルを自動作成する設定
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 起動時: テーブル作成
    SQLModel.metadata.create_all(bind=engine)
    yield
    # 終了時: 必要なら処理を書く

app = FastAPI(title="TaskMaster-Backend", lifespan=lifespan)

# CORS設定 (変更なし)
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "FastAPI Backend is running! (TaskMaster)"}

# ★重要: 作ったAPIをここで登録する
app.include_router(api_router, prefix="/api/v1")