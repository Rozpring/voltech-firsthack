from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.session import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.api.v1.endpoints.users import get_current_user

router = APIRouter()

@router.get("/stats")
def get_task_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    all_tasks = db.query(Task).filter(Task.owner_id == current_user.id).all()
    
    total = len(all_tasks)
    completed = sum(1 for t in all_tasks if t.is_completed)
    progress_rate = int((completed / total) * 100) if total > 0 else 0
    
    now = datetime.now()
    overdue = sum(1 for t in all_tasks if not t.is_completed and t.deadline and t.deadline < now)

    # 機嫌ロジック
    mood = "normal"
    message = "調子はどう？"
    if overdue > 3:
        mood = "angry"
        message = "期限切れ多すぎ！早くやりなさいよ！"
    elif overdue > 0:
        mood = "grumpy"
        message = "期限切れてるわよ..."
    elif progress_rate == 100 and total > 0:
        mood = "happy"
        message = "完璧ね！素晴らしい！"

    return {
        "total": total,
        "completed": completed,
        "overdue": overdue,
        "progress_rate": progress_rate,
        "mood": mood,
        "message": message
    }

@router.get("/", response_model=List[TaskResponse])
def read_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    is_completed: Optional[bool] = None,    # 完了状態で絞り込み
    location_id: Optional[int] = None,      # 場所で絞り込み
    start_date: Optional[datetime] = None,  # カレンダー用開始日
    end_date: Optional[datetime] = None     # カレンダー用終了日
):
    query = db.query(Task).filter(Task.owner_id == current_user.id)

    # 各条件があればフィルタに追加
    if is_completed is not None:
        query = query.filter(Task.is_completed == is_completed)
    if location_id is not None:
        query = query.filter(Task.location_id == location_id)
    if start_date:
        query = query.filter(Task.deadline >= start_date)
    if end_date:
        query = query.filter(Task.deadline <= end_date)

    return query.offset(skip).limit(limit).all()


@router.post("/", response_model=TaskResponse)
def create_task(
    *, 
    db: Session = Depends(get_db), 
    task_in: TaskCreate, 
    current_user: User = Depends(get_current_user)
):
    db_task = Task(**task_in.model_dump(), owner_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

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

    update_data = task_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
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
    return {"message": "Task deleted"}