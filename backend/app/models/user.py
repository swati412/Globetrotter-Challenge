from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from ..utils.model_utils import PyObjectId

class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    username: str
    score: int = 0
    correct_answers: int = 0
    total_attempts: int = 0
    created_at: datetime = Field(default_factory=datetime.now)
    
    class Config:
        populate_by_name = True
        json_encoders = {PyObjectId: str}

class UserCreate(BaseModel):
    username: str
    initial_score: int = 0
    initial_correct_answers: int = 0
    initial_total_attempts: int = 0

class UserResponse(BaseModel):
    id: str
    username: str
    score: int
    correct_answers: int
    total_attempts: int
    created_at: datetime