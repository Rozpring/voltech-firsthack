from pydantic import BaseModel
from typing import Optional

class LocationBase(BaseModel):
    name: str
    latitude: float
    longitude: float
    radius: Optional[float] = 500.0  # デフォルト500メートル
    category_id: Optional[int] = None

class LocationCreate(LocationBase):
    pass

class LocationUpdate(BaseModel):
    name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius: Optional[float] = None
    category_id: Optional[int] = None

class LocationResponse(LocationBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

class NearbyLocationResponse(LocationResponse):
    """現在地からの距離情報を含む場所レスポンス"""
    distance: float  # 現在地からの距離（メートル）