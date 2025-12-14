from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.api import deps
from app.models.user import User
from app.models.notification import NotificationDevice
from app.schemas.notification import NotificationDeviceCreate, NotificationDeviceResponse

router = APIRouter()

@router.post("/users/me/devices", response_model=NotificationDeviceResponse)
def register_device(
    device_in: NotificationDeviceCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    プッシュ通知用のデバイストークンを登録する。
    既に同じトークンがある場合は登録済みのものを返す。
    """
    # 既存チェック
    statement = select(NotificationDevice).where(
        NotificationDevice.user_id == current_user.id,
        NotificationDevice.device_token == device_in.device_token
    )
    existing_device = db.exec(statement).first()

    if existing_device:
        # 既に存在する場合は更新せずそのまま返す（必要なら最終アクセス日時などを更新）
        return existing_device

    # 新規作成
    new_device = NotificationDevice(
        user_id=current_user.id,
        device_token=device_in.device_token,
        device_type=device_in.device_type
    )
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device

@router.delete("/users/me/devices/{device_token}")
def delete_device(
    device_token: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    指定されたデバイストークンを削除する（ログアウト時など）。
    """
    statement = select(NotificationDevice).where(
        NotificationDevice.user_id == current_user.id,
        NotificationDevice.device_token == device_token
    )
    device = db.exec(statement).first()

    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    db.delete(device)
    db.commit()
    return {"status": "success", "message": "Device token deleted"}