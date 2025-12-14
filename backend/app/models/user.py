#ユーザー情報のデータ構造を定義。
#登録/ログイン機能

from sqlalchemy import Column, Integer, String, Boolean
from app.db.base import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    display_name = Column(String, nullable=True)  # 表示名
    avatar_url = Column(String, nullable=True)    # アイコン画像URL（Base64も可）
    
    # リレーション定義
    tasks = relationship("Task", back_populates="owner")
    categories = relationship("Category", back_populates="owner")
    locations = relationship("Location", back_populates="owner")
