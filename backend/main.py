# アプリケーションのエントリーポイント
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# 環境変数をロード (CORS設定などに使用)
load_dotenv()

app = FastAPI(title="TaskMaster-Backend")

# CORS設定：Reactからアクセスできるようにする
# 開発中はReactの実行URL (通常は http://localhost:5173 または http://localhost:3000) を許可します。
origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
    "http://localhost:3000",
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

# TODO: 今後、タスク関連のルーターをここにインクルードする
# from .api.v1.api import router
# app.include_router(router, prefix="/api/v1")