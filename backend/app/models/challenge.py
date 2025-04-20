from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime
import uuid
from ..utils.model_utils import PyObjectId

class Challenge(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    challenge_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    creator_id: str
    status: str = "created"  # created, accepted, completed
    opponent_id: Optional[str] = None
    opponent_username: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    
    class Config:
        populate_by_name = True
        json_encoders = {PyObjectId: str}

class ChallengeResponse(BaseModel):
    challenge_id: str
    creator: Dict
    status: Optional[str] = "created"
    opponent_username: Optional[str] = None
    created_at: Optional[datetime] = None