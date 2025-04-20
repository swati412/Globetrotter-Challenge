from fastapi import APIRouter, HTTPException
from ..models.challenge import Challenge, ChallengeResponse
from ..services import challenge_service

router = APIRouter()

@router.post("", response_model=Challenge)
async def create_challenge(creator_username: str):
    challenge = await challenge_service.create_challenge(creator_username)
    if not challenge:
        raise HTTPException(status_code=404, detail="User not found")
    
    return challenge

@router.get("/{challenge_id}", response_model=ChallengeResponse)
async def get_challenge(challenge_id: str):
    challenge = await challenge_service.get_challenge_by_id(challenge_id)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    return challenge
    
@router.post("/{challenge_id}/accept", response_model=ChallengeResponse)
async def accept_challenge(challenge_id: str, username: str):
    # Check if the challenge exists
    challenge = await challenge_service.get_challenge_by_id(challenge_id)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Accept the challenge (implement this in challenge_service)
    accepted_challenge = await challenge_service.accept_challenge(challenge_id, username)
    if not accepted_challenge:
        raise HTTPException(status_code=400, detail="Failed to accept challenge")
    
    return accepted_challenge