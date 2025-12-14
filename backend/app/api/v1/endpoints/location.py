from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import math

from app.db.session import get_db
from app.models.location import Location
from app.models.user import User
from app.schemas.location import LocationCreate, LocationResponse, LocationUpdate, NearbyLocationResponse
from app.api.v1.endpoints.users import get_current_user

router = APIRouter()


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Haversine公式を使用して2点間の距離（メートル）を計算
    """
    R = 6371000  # 地球の半径（メートル）
    
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = math.sin(delta_phi / 2) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c


# 場所一覧取得
@router.get("/", response_model=List[LocationResponse])
def read_locations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Location).filter(Location.owner_id == current_user.id).all()


# 現在地から近くの場所を検索
@router.get("/nearby", response_model=Optional[NearbyLocationResponse])
def find_nearby_location(
    latitude: float = Query(..., description="現在地の緯度"),
    longitude: float = Query(..., description="現在地の経度"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    現在地から最も近い登録場所を検索し、その場所のエリア内であれば返す
    """
    locations = db.query(Location).filter(Location.owner_id == current_user.id).all()
    
    nearest_location = None
    min_distance = float('inf')
    
    for location in locations:
        distance = calculate_distance(
            latitude, longitude,
            location.latitude, location.longitude
        )
        
        # エリア内かつ最も近い場所を検索
        if distance <= location.radius and distance < min_distance:
            min_distance = distance
            nearest_location = location
    
    if nearest_location:
        return NearbyLocationResponse(
            id=nearest_location.id,
            name=nearest_location.name,
            latitude=nearest_location.latitude,
            longitude=nearest_location.longitude,
            radius=nearest_location.radius,
            category_id=nearest_location.category_id,
            owner_id=nearest_location.owner_id,
            distance=min_distance
        )
    
    return None


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


# 場所取得
@router.get("/{location_id}", response_model=LocationResponse)
def read_location(
    location_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    location = db.query(Location).filter(
        Location.id == location_id,
        Location.owner_id == current_user.id
    ).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location


# 場所更新
@router.put("/{location_id}", response_model=LocationResponse)
def update_location(
    location_id: int,
    location_in: LocationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    location = db.query(Location).filter(
        Location.id == location_id,
        Location.owner_id == current_user.id
    ).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    update_data = location_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(location, key, value)
    
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
    location = db.query(Location).filter(
        Location.id == location_id,
        Location.owner_id == current_user.id
    ).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    db.delete(location)
    db.commit()
    return {"message": "Location deleted"}