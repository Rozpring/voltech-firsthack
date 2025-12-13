# UserCreate, UserLogin, UserResponse

from pydantic import BaseModel

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str # 作成時にパスワードを受け取る

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True # SQLAlchemyモデルからの変換を許可