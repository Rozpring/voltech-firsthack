from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.location import Location
from app.models.user import User
from app.schemas.location import LocationCreate, LocationResponse
from app.api.v1.endpoints.users import get_current_user

router = APIRouter()

# 場所一覧取得
@router.get("/", response_model=List[LocationResponse])
def read_locations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Location).filter(Location.owner_id == current_user.id).all()

# 場所登録
@router.post("/", response_model=LocationResponse)
def create_location(
    location_in: LocationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    location = Location(**location_in.model_dump(), owner_id=current_user.id)
    db.add(location)
    db.commit()
    db.refresh(location)
    return location

# 場所削除
@router.delete("/{location_id}")
def delete_location(
    location_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    location = db.query(Location).filter(Location.id == location_id, Location.owner_id == current_user.id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    db.delete(location)
    db.commit()
    return {"message": "Location deleted"}