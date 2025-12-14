from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel

class NotificationDeviceBase(SQLModel):
    device_token: str
    device_type: Optional[str] = None

class NotificationDeviceCreate(NotificationDeviceBase):
    pass

class NotificationDeviceResponse(NotificationDeviceBase):
    id: int
    user_id: int
    created_at: datetime