import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TaskMaster API"
    API_V1_STR: str = "/api/v1"
    
    # データベース設定
    # 環境変数から読み込む。設定されていない場合はSQLiteをデフォルトとする。
    SQLALCHEMY_DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

    class Config:
        case_sensitive = True

settings = Settings()
