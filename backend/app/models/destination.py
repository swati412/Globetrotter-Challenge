from pydantic import BaseModel, Field
from typing import List, Optional
from ..utils.model_utils import PyObjectId

class Destination(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    city: str
    country: str
    clues: List[str]
    fun_fact: List[str]
    trivia: List[str]
    
    class Config:
        populate_by_name = True
        json_encoders = {PyObjectId: str}

class DestinationResponse(BaseModel):
    id: str
    clues: List[str]
    options: List[dict]

class AnswerRequest(BaseModel):
    destination_id: str
    answer: str
    username: Optional[str] = None

class AnswerResponse(BaseModel):
    correct: bool
    correct_answer: dict
    fun_fact: str
    score_update: Optional[int] = None