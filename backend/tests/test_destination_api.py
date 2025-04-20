import pytest
from fastapi.testclient import TestClient

def test_get_random_destination(test_client):
    """Test getting a random destination"""
    # Act
    response = test_client.get("/destinations/random")
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "clues" in data
    assert "options" in data
    assert len(data["options"]) == 4  # Should have 4 options

def test_check_answer_correct(test_client):
    """Test checking a correct answer"""
    # Arrange - get a random destination first
    response = test_client.get("/destinations/random")
    destination = response.json()
    destination_id = destination["id"]
    
    # Find correct option
    # For test purposes, let's try all options until we find one that works
    # In a real test, we'd need a more deterministic approach
    correct_answer = None
    for option in destination["options"]:
        answer = f"{option['city']}, {option['country']}"
        check_response = test_client.post(
            "/destinations/answer",
            json={
                "destination_id": destination_id,
                "answer": answer
            }
        )
        
        if check_response.json().get("correct"):
            correct_answer = answer
            break
    
    # Assert
    assert correct_answer is not None
    
    # Verify the response structure
    assert check_response.status_code == 200
    data = check_response.json()
    assert "correct" in data
    assert data["correct"] is True
    assert "fun_fact" in data
    assert "correct_answer" in data

def test_check_answer_incorrect(test_client):
    """Test checking an incorrect answer"""
    # Arrange - get a random destination first
    response = test_client.get("/destinations/random")
    destination = response.json()
    destination_id = destination["id"]
    
    # Act - use a clearly wrong answer
    response = test_client.post(
        "/destinations/answer",
        json={
            "destination_id": destination_id,
            "answer": "Wrong City, Wrong Country"
        }
    )
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert "correct" in data
    assert data["correct"] is False
    assert "fun_fact" in data
    assert "correct_answer" in data