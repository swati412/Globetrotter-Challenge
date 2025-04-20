import pytest
from fastapi.testclient import TestClient

def test_create_challenge(test_client):
    """Test creating a challenge"""
    # Arrange - create user first
    username = "challenge_test_user"
    test_client.post("/users", json={"username": username})
    
    # Act
    response = test_client.post(f"/challenges?creator_username={username}")
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert "challenge_id" in data
    assert "creator_id" in data

def test_get_challenge(test_client):
    """Test getting a challenge by ID"""
    # Arrange - create user and challenge first
    username = "get_challenge_test_user"
    test_client.post("/users", json={"username": username})
    
    challenge_response = test_client.post(f"/challenges?creator_username={username}")
    challenge_id = challenge_response.json()["challenge_id"]
    
    # Act
    response = test_client.get(f"/challenges/{challenge_id}")
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["challenge_id"] == challenge_id
    assert "creator" in data
    assert data["creator"]["username"] == username

def test_challenge_with_invalid_user(test_client):
    """Test creating a challenge with a non-existent user"""
    # Act
    response = test_client.post("/challenges?creator_username=nonexistent_user")
    
    # Assert
    assert response.status_code == 404
    assert "error" in response.json()

def test_get_nonexistent_challenge(test_client):
    """Test getting a non-existent challenge"""
    # Act
    response = test_client.get("/challenges/nonexistent-challenge-id")
    
    # Assert
    assert response.status_code == 404
    assert "error" in response.json()