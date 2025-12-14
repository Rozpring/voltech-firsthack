# TaskMaster (voltech-firsthack)

タスク管理アプリケーション - バックエンド: FastAPI / フロントエンド: React + TypeScript

## 🚀 起動方法

### バックエンド

```bash
cd backend
source venv/bin/activate
python -m uvicorn main:app --reload --port 8000
```

- **API:** http://localhost:8000
- **Swagger UI:** http://localhost:8000/docs

### フロントエンド

```bash
cd frontend
npm install  # 初回のみ
npm run dev
```

- **アプリ:** http://localhost:5173

## 📁 プロジェクト構成

```
voltech-firsthack/
├── backend/          # FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── api/      # APIエンドポイント
│   │   ├── core/     # 設定、認証
│   │   ├── db/       # データベース設定
│   │   ├── models/   # SQLAlchemyモデル
│   │   └── schemas/  # Pydanticスキーマ
│   └── main.py
└── frontend/         # React + Vite + TailwindCSS
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        └── services/
```
