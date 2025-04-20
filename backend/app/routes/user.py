from fastapi import APIRouter
from ..models.user import UserCreate, UserResponse
from ..services import user_service

router = APIRouter()

@router.post("", response_model=UserResponse)
async def create_user(user: UserCreate):
    return await user_service.create_user(user)

@router.get("/{username}", response_model=UserResponse)
async def get_user(username: str):
    return await user_service.get_user_by_username(username)