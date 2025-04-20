from fastapi import APIRouter, HTTPException
from ..models.destination import DestinationResponse, AnswerRequest, AnswerResponse
from ..services import destination_service, user_service

router = APIRouter()

@router.get("/random", response_model=DestinationResponse)
async def get_random_destination():
    destination = await destination_service.get_random_destination_with_options()
    if not destination:
        raise HTTPException(status_code=404, detail="No destinations found")
    
    return destination

@router.post("/answer", response_model=AnswerResponse)
async def check_answer(answer_request: AnswerRequest):
    result, error = await destination_service.check_answer(answer_request)
    if error:
        raise HTTPException(status_code=404, detail=error)
    
    if answer_request.username:
        points = result.score_update
        await user_service.update_user_score(
            answer_request.username, 
            points, 
            result.correct
        )
    
    return result