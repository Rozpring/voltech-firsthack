# タスク関連のCRUD

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.models.task import Task
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()
# get_current_userの定義が必要です

## タスク一覧取得 (GET /tasks/)
@router.get("/", response_model=List[TaskResponse])
def read_tasks(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user), # 認証保護
    skip: int = 0, limit: int = 100
):
    # ログインユーザーが所有するタスクのみを取得
    tasks = db.query(Task).filter(Task.owner_id == current_user.id).offset(skip).limit(limit).all()
    # フィルタリング/ソートロジックはここに追加
    return tasks

## タスク作成 (POST /tasks/)
@router.post("/", response_model=TaskResponse)
def create_task(
    *, 
    db: Session = Depends(get_db), 
    task_in: TaskCreate, 
    current_user: User = Depends(get_current_user) # 認証保護
):
    db_task = Task(**task_in.model_dump(), owner_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

## タスク詳細取得 (GET /tasks/{task_id})
@router.get("/{task_id}", response_model=TaskResponse)
def read_task(
    *, 
    db: Session = Depends(get_db), 
    task_id: int, 
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

## タスク更新 (PUT /tasks/{task_id})
@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    *,
    db: Session = Depends(get_db),
    task_id: int,
    task_in: TaskUpdate,
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Pydanticモデルから辞書に変換し、Noneでない値で更新
    update_data = task_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    db.add(task)
    db.commit()
    db.refresh(task)
    return task

## タスク削除 (DELETE /tasks/{task_id})
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    *, 
    db: Session = Depends(get_db), 
    task_id: int, 
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}