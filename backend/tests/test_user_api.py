import pytest
from fastapi.testclient import TestClient

def test_create_user(test_client):
    """Test creating a user via API"""
    # Arrange
    username = "api_test_user"
    
    # Act
    response = test_client.post(
        "/users",
        json={"username": username}
    )
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == username
    assert "id" in data
    assert data["score"] == 0

def test_create_user_validation_error(test_client):
    """Test validation error when creating a user"""
    # Arrange - empty username
    
    # Act
    response = test_client.post(
        "/users",
        json={"username": ""}
    )
    
    # Assert
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "VALIDATION_ERROR"

def test_get_user(test_client):
    """Test getting a user by username"""
    # Arrange - create user first
    username = "get_api_test_user"
    test_client.post("/users", json={"username": username})
    
    # Act
    response = test_client.get(f"/users/{username}")
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == username

def test_get_nonexistent_user(test_client):
    """Test getting a non-existent user"""
    # Act
    response = test_client.get("/users/nonexistent_api_user")
    
    # Assert
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert "not found" in data["error"]["message"].lower()