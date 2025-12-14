from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    priority: int = 2
    location_id: Optional[int] = None
    category_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    # 更新時はすべてオプショナルにする
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
    deadline: Optional[datetime] = None
    priority: Optional[int] = None
    location_id: Optional[int] = None
    category_id: Optional[int] = None

class TaskResponse(TaskBase):
    id: int
    is_completed: bool
    owner_id: int
    created_at: datetime
    category_id: Optional[int] = None
    
    class Config:
        from_attributes = True