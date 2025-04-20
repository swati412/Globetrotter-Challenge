import pytest
from app.models.user import UserCreate
from app.services import user_service
from app.utils.exceptions import ResourceNotFoundException, DuplicateResourceException

@pytest.mark.asyncio
async def test_create_user(test_db_client):
    """Test creating a new user"""
    # Arrange
    username = "testuser"
    user_data = UserCreate(username=username)
    
    # Act
    user = await user_service.create_user(user_data)
    
    # Assert
    assert user is not None
    assert user.username == username
    assert user.score == 0
    assert user.correct_answers == 0
    assert user.total_attempts == 0

@pytest.mark.asyncio
async def test_create_duplicate_user(test_db_client):
    """Test creating a user with a duplicate username"""
    # Arrange
    username = "duplicate_user"
    user_data = UserCreate(username=username)
    
    # Create user first time
    await user_service.create_user(user_data)
    
    # Act & Assert - Should raise exception on duplicate
    with pytest.raises(DuplicateResourceException):
        await user_service.create_user(user_data)

@pytest.mark.asyncio
async def test_get_user_by_username(test_db_client):
    """Test retrieving a user by username"""
    # Arrange
    username = "get_test_user"
    user_data = UserCreate(username=username)
    created_user = await user_service.create_user(user_data)
    
    # Act
    user = await user_service.get_user_by_username(username)
    
    # Assert
    assert user is not None
    assert user.id == created_user.id
    assert user.username == username

@pytest.mark.asyncio
async def test_get_nonexistent_user(test_db_client):
    """Test retrieving a non-existent user"""
    # Act & Assert
    with pytest.raises(ResourceNotFoundException):
        await user_service.get_user_by_username("nonexistent_user")

@pytest.mark.asyncio
async def test_update_user_score(test_db_client):
    """Test updating a user's score"""
    # Arrange
    username = "score_test_user"
    user_data = UserCreate(username=username)
    await user_service.create_user(user_data)
    
    # Act
    success = await user_service.update_user_score(username, 10, True)
    
    # Assert
    assert success is True
    
    # Verify score was updated
    user = await user_service.get_user_by_username(username)
    assert user.score == 10
    assert user.correct_answers == 1
    assert user.total_attempts == 1