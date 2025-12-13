# TaskCreate, TaskUpdate, TaskResponseなど

from pydantic import BaseModel
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    description: str | None = None
    deadline: datetime | None = None
    priority: str = "medium"
    category: str | None = None
    category_id: int | None = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    deadline: datetime | None = None
    priority: str | None = None
    category: str | None = None
    category_id: int | None = None
    is_completed: bool | None = None

class TaskResponse(TaskBase):
    id: int
    is_completed: bool
    owner_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True