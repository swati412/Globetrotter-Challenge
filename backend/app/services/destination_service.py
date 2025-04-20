from ..utils.database import destinations_collection
from ..models.destination import Destination, DestinationResponse, AnswerRequest, AnswerResponse
from bson import ObjectId
import random
from typing import List

async def get_random_destinations(count: int = 4) -> List[Destination]:
    destinations = await destinations_collection.aggregate([{"$sample": {"size": count}}]).to_list(count)
    return [Destination(**d) for d in destinations]

async def get_random_destination_with_options() -> DestinationResponse:
    destinations = await get_random_destinations(4)
    if not destinations:
        return None
    
    correct = destinations[0]
    
    num_clues = random.randint(1, min(2, len(correct.clues)))
    selected_clues = random.sample(correct.clues, num_clues)
    
    options = [{"city": d.city, "country": d.country} for d in destinations]
    random.shuffle(options)
    
    return DestinationResponse(
        id=str(correct.id),
        clues=selected_clues,
        options=options
    )

async def check_answer(answer_request: AnswerRequest) -> (AnswerResponse, str):
    destination = await destinations_collection.find_one({"_id": ObjectId(answer_request.destination_id)})
    if not destination:
        return None, "Destination not found"
    
    destination = Destination(**destination)
    correct_answer = {"city": destination.city, "country": destination.country}
    
    answer_text = answer_request.answer.lower()
    expected_answers = [
        f"{destination.city.lower()}, {destination.country.lower()}",
        destination.city.lower()
    ]
    is_correct = any(answer_text == expected for expected in expected_answers)
    
    fun_fact = random.choice(destination.fun_fact)
    
    return AnswerResponse(
        correct=is_correct,
        correct_answer=correct_answer,
        fun_fact=fun_fact,
        score_update=10 if is_correct else 0
    ), None