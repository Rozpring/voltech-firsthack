from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)  # "自宅", "学校" など
    latitude = Column(Float)           # 緯度
    longitude = Column(Float)          # 経度
    
    # ユーザーとの関係
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="locations")
    
    # タスクとの関係
    tasks = relationship("Task", back_populates="location")