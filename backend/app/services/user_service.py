from ..utils.database import users_collection
from ..models.user import User, UserCreate, UserResponse
from ..utils.exceptions import ResourceNotFoundException, DuplicateResourceException, DatabaseException
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

async def create_user(user_data: UserCreate) -> UserResponse:
    """
    Create a new user, optionally with initial stats for anonymous players
    """
    try:
        existing_user = await users_collection.find_one({"username": user_data.username})
        if existing_user:
            raise DuplicateResourceException(
                resource_type="User",
                detail=f"Username '{user_data.username}' is already taken"
            )
        
        # Create user with initial stats (will be zeros if not playing anonymously)
        new_user = User(
            username=user_data.username,
            score=user_data.initial_score,
            correct_answers=user_data.initial_correct_answers,
            total_attempts=user_data.initial_total_attempts
        )
        
        result = await users_collection.insert_one(new_user.dict(by_alias=True, exclude_none=True))
        
        created_user = await users_collection.find_one({"_id": result.inserted_id})
        user = User(**created_user)
        
        return UserResponse(
            id=str(user.id),
            username=user.username,
            score=user.score,
            correct_answers=user.correct_answers,
            total_attempts=user.total_attempts,
            created_at=user.created_at
        )
    except DuplicateResourceException:
        raise
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}", exc_info=True)
        raise DatabaseException(f"Failed to create user: {str(e)}")

async def get_user_by_username(username: str) -> UserResponse:
    try:
        user_data = await users_collection.find_one({"username": username})
        if not user_data:
            raise ResourceNotFoundException(
                resource_type="User", 
                detail=f"User with username '{username}' not found"
            )
        
        user = User(**user_data)
        
        return UserResponse(
            id=str(user.id),
            username=user.username,
            score=user.score,
            correct_answers=user.correct_answers,
            total_attempts=user.total_attempts,
            created_at=user.created_at
        )
    except ResourceNotFoundException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving user by username: {str(e)}", exc_info=True)
        raise DatabaseException(f"Failed to retrieve user: {str(e)}")

async def get_user_by_id(user_id: str) -> UserResponse:
    try:
        user_data = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user_data:
            raise ResourceNotFoundException(
                resource_type="User", 
                detail=f"User with ID '{user_id}' not found"
            )
        
        user = User(**user_data)
        
        return UserResponse(
            id=str(user.id),
            username=user.username,
            score=user.score,
            correct_answers=user.correct_answers,
            total_attempts=user.total_attempts,
            created_at=user.created_at
        )
    except ResourceNotFoundException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving user by ID: {str(e)}", exc_info=True)
        raise DatabaseException(f"Failed to retrieve user: {str(e)}")

async def update_user_score(username: str, points: int, is_correct: bool) -> bool:
    try:
        result = await users_collection.update_one(
            {"username": username},
            {
                "$inc": {
                    "score": points,
                    "correct_answers": 1 if is_correct else 0,
                    "total_attempts": 1
                }
            }
        )
        
        if result.modified_count == 0:
            logger.warning(f"Failed to update score for user '{username}'")
            return False
            
        return True
    except ResourceNotFoundException:
        raise
    except Exception as e:
        logger.error(f"Error updating user score: {str(e)}", exc_info=True)
        raise DatabaseException(f"Failed to update user score: {str(e)}")