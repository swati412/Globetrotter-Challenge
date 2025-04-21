from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from typing import List, Optional, Dict, Any
from bson import ObjectId
import json

# Configuration
DATABASE_NAME = os.getenv("DATABASE_NAME", "globetrotter")
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# Create FastAPI app
app = FastAPI(title="Globetrotter API")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
mongodb_client = None
database = None

@app.on_event("startup")
async def startup_db_client():
    global mongodb_client, database
    mongodb_client = AsyncIOMotorClient(MONGO_URL)
    database = mongodb_client[DATABASE_NAME]

@app.on_event("shutdown")
async def shutdown_db_client():
    if mongodb_client:
        mongodb_client.close()

# Helper function for ObjectId
def parse_objectid(id_str: str) -> ObjectId:
    if not ObjectId.is_valid(id_str):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    return ObjectId(id_str)

# Basic API endpoints
@app.get("/")
async def root():
    return {"message": "Welcome to the Globetrotter API"}

@app.get("/destinations")
async def get_destinations():
    destinations = await database.destinations.find().to_list(100)
    
    # Convert ObjectId to string for JSON serialization
    for dest in destinations:
        dest["_id"] = str(dest["_id"])
    
    return destinations

@app.get("/destinations/{destination_id}")
async def get_destination(destination_id: str):
    dest = await database.destinations.find_one({"_id": parse_objectid(destination_id)})
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    # Convert ObjectId to string
    dest["_id"] = str(dest["_id"])
    
    return dest

@app.get("/users/{username}")
async def get_user(username: str):
    user = await database.users.find_one({"username": username})
    if not user:
        return {"exists": False}
    
    # Convert ObjectId to string
    user["_id"] = str(user["_id"])
    
    return {"exists": True, "user": user}

@app.post("/users")
async def create_user(user_data: Dict[str, Any]):
    # Check if username already exists
    existing_user = await database.users.find_one({"username": user_data["username"]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Insert new user
    result = await database.users.insert_one(user_data)
    
    # Return created user
    created_user = await database.users.find_one({"_id": result.inserted_id})
    created_user["_id"] = str(created_user["_id"])
    
    return created_user

@app.get("/challenges/{challenge_id}")
async def get_challenge(challenge_id: str):
    challenge = await database.challenges.find_one({"_id": parse_objectid(challenge_id)})
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Convert ObjectId to string
    challenge["_id"] = str(challenge["_id"])
    
    return challenge

@app.post("/challenges")
async def create_challenge(challenge_data: Dict[str, Any]):
    result = await database.challenges.insert_one(challenge_data)
    
    # Return created challenge
    created_challenge = await database.challenges.find_one({"_id": result.inserted_id})
    created_challenge["_id"] = str(created_challenge["_id"])
    
    return created_challenge 