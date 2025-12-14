#タスクのデータ構造を定義（タスク名、期限、優先度、カテゴリ、完了フラグ、位置情報トリガーなど）。
#タスクの追加/編集/削除、期限設定、完了チェック、タグ/カテゴリ、優先度設定、位置情報

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String)
    is_completed = Column(Boolean, default=False)
    priority = Column(Integer, default=2)          # 1:低, 2:中, 3:高
    deadline = Column(DateTime, nullable=True)     # 期限
    
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    location = relationship("Location", back_populates="tasks")
    created_at = Column(DateTime, default=func.now())
    
    # ユーザーとの関連付け
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="tasks")
    
    # カテゴリとの関連付け
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    category = relationship("Category", back_populates="tasks")