from typing import List, Optional, TYPE_CHECKING
from sqlmodel import Field, Relationship, SQLModel

# 循環参照エラーを防ぐため、型チェック時のみインポートします
if TYPE_CHECKING:
    from app.models.task import Task
    from app.models.location import Location
    from app.models.notification import NotificationDevice

class User(SQLModel, table=True):
    __tablename__ = "users"

    # --- カラム定義 (SQLModelスタイル) ---
    # Column(...) ではなく、型ヒントと Field(...) を使います
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True) # nullable=Falseはデフォルト
    hashed_password: str
    
    # 指示通り追加したフィールド
    receive_reminders: bool = Field(default=True)

    # --- リレーション定義 (SQLModelスタイル) ---
    # relationship(...) ではなく Relationship(...) を使います
    tasks: List["Task"] = Relationship(back_populates="owner")
    locations: List["Location"] = Relationship(back_populates="owner")
    
    # 指示通り追加したリレーション
    notification_devices: List["NotificationDevice"] = Relationship(back_populates="user")
