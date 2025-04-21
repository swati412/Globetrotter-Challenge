from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
from bson import ObjectId
import json
import random
import uuid
from datetime import datetime

# Configuration
DATABASE_NAME = os.getenv("DATABASE_NAME", "globetrotter")
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,https://globetrotter-kappa.vercel.app").split(",")

print(f"Allowed origins: {ALLOWED_ORIGINS}")

# Create Flask app
app = Flask(__name__)

# Configure CORS - more permissive configuration
CORS(app, 
     resources={r"/*": {
         "origins": ALLOWED_ORIGINS,
         "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "supports_credentials": True
     }})

# Also add CORS headers via a decorator to ensure they're added to all responses
@app.after_request
def add_cors_headers(response):
    # Get the origin from the request
    origin = request.headers.get('Origin')
    
    # If the origin matches our allowed origins, set the headers
    if origin and origin in ALLOWED_ORIGINS:
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Connect to MongoDB
try:
    mongo_client = MongoClient(MONGO_URL)
    db = mongo_client[DATABASE_NAME]
    # Test the connection
    mongo_client.admin.command('ping')
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection error: {str(e)}")
    # Still create a client in case connection is established later
    mongo_client = MongoClient(MONGO_URL)
    db = mongo_client[DATABASE_NAME]

# Helper function for ObjectId
def parse_objectid(id_str):
    if not ObjectId.is_valid(id_str):
        return None
    return ObjectId(id_str)

# Custom JSONEncoder to handle ObjectId
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

app.json_encoder = CustomJSONEncoder

# Basic API endpoints
@app.route("/")
def root():
    return jsonify({"message": "Welcome to the Globetrotter API"})

# Destination endpoints
@app.route("/destinations")
def get_destinations():
    destinations = list(db.destinations.find(limit=100))
    return jsonify(destinations)

@app.route("/destinations/random")
def get_random_destination_with_options():
    # Implementation of destination_service.get_random_destination_with_options()
    # Get 4 random destinations
    count = db.destinations.count_documents({})
    if count == 0:
        return jsonify({"error": "No destinations found"}), 404
    
    try:
        # Get 4 random destinations
        destinations = []
        pipeline = [{"$sample": {"size": 4}}]
        cursor = db.destinations.aggregate(pipeline)
        destinations = list(cursor)
        
        if not destinations:
            return jsonify({"error": "No destinations found"}), 404
        
        # Choose the first one as correct
        correct = destinations[0]
        
        # Select 1-2 random clues
        if "clues" in correct and correct["clues"]:
            num_clues = random.randint(1, min(2, len(correct["clues"])))
            selected_clues = random.sample(correct["clues"], num_clues)
        else:
            selected_clues = []
        
        # Format options
        options = []
        for dest in destinations:
            options.append({
                "city": dest.get("city", "Unknown"),
                "country": dest.get("country", "Unknown")
            })
        
        # Shuffle options
        random.shuffle(options)
        
        response = {
            "id": str(correct["_id"]),
            "clues": selected_clues,
            "options": options
        }
        
        return jsonify(response)
    except Exception as e:
        print(f"Error fetching random destination with options: {str(e)}")
        return jsonify({"error": "Error fetching random destination"}), 500

@app.route("/destinations/<destination_id>")
def get_destination(destination_id):
    obj_id = parse_objectid(destination_id)
    if not obj_id:
        return jsonify({"error": "Invalid ID format"}), 400
    
    dest = db.destinations.find_one({"_id": obj_id})
    if not dest:
        return jsonify({"error": "Destination not found"}), 404
    
    return jsonify(dest)

@app.route("/destinations/answer", methods=["POST"])
def check_answer():
    # Implementation of destination_service.check_answer()
    try:
        answer_request = request.json
        if not answer_request or "destination_id" not in answer_request or "answer" not in answer_request:
            return jsonify({"error": "Invalid request data"}), 400
        
        # Get the destination
        destination_id = answer_request["destination_id"]
        answer_text = answer_request["answer"].lower()
        username = answer_request.get("username")
        
        # Find the destination by ID
        obj_id = parse_objectid(destination_id)
        if not obj_id:
            return jsonify({"error": "Invalid destination ID format"}), 400
        
        destination = db.destinations.find_one({"_id": obj_id})
        if not destination:
            return jsonify({"error": "Destination not found"}), 404
        
        # Compare the answer
        correct_answer = {
            "city": destination.get("city", "Unknown"), 
            "country": destination.get("country", "Unknown")
        }
        
        expected_answers = [
            f"{destination.get('city', '').lower()}, {destination.get('country', '').lower()}",
            destination.get('city', '').lower()
        ]
        
        is_correct = any(answer_text == expected for expected in expected_answers)
        score_update = 10 if is_correct else 0
        
        # If a username is provided, update their score
        if username:
            # Update user score
            if is_correct:
                db.users.update_one(
                    {"username": username},
                    {"$inc": {
                        "score": score_update,
                        "correct_answers": 1 if is_correct else 0,
                        "total_attempts": 1
                    }}
                )
            else:
                db.users.update_one(
                    {"username": username},
                    {"$inc": {"total_attempts": 1}}
                )
        
        # Get a random fun fact
        fun_facts = destination.get("fun_fact", ["No fun facts available"])
        fun_fact = random.choice(fun_facts) if fun_facts else "No fun facts available"
        
        # Return the result
        response = {
            "correct": is_correct,
            "correct_answer": correct_answer,
            "fun_fact": fun_fact,
            "score_update": score_update
        }
        
        return jsonify(response)
    except Exception as e:
        print(f"Error checking answer: {str(e)}")
        return jsonify({"error": f"Error checking answer: {str(e)}"}), 500

# User endpoints
@app.route("/users/<username>")
def get_user(username):
    user = db.users.find_one({"username": username})
    if not user:
        return jsonify({"exists": False})
    
    # Format response similar to the FastAPI implementation
    response = {
        "id": str(user.get("_id")),
        "username": user.get("username"),
        "score": user.get("score", 0),
        "correct_answers": user.get("correct_answers", 0),
        "total_attempts": user.get("total_attempts", 0),
        "created_at": user.get("created_at", datetime.now()),
        "exists": True
    }
    
    return jsonify(response)

@app.route("/users", methods=["POST"])
def create_user():
    try:
        user_data = request.json
        if not user_data or "username" not in user_data:
            return jsonify({"error": "Invalid user data"}), 400
        
        # Check if username already exists
        username = user_data["username"]
        existing_user = db.users.find_one({"username": username})
        if existing_user:
            return jsonify({"error": "Username already exists"}), 400
        
        # Create user with initial stats
        new_user = {
            "username": username,
            "score": user_data.get("initial_score", 0),
            "correct_answers": user_data.get("initial_correct_answers", 0),
            "total_attempts": user_data.get("initial_total_attempts", 0),
            "created_at": datetime.now()
        }
        
        # Insert new user
        result = db.users.insert_one(new_user)
        
        # Return created user
        created_user = db.users.find_one({"_id": result.inserted_id})
        response = {
            "id": str(created_user.get("_id")),
            "username": created_user.get("username"),
            "score": created_user.get("score", 0),
            "correct_answers": created_user.get("correct_answers", 0),
            "total_attempts": created_user.get("total_attempts", 0),
            "created_at": created_user.get("created_at", datetime.now()),
        }
        
        return jsonify(response)
    except Exception as e:
        print(f"Error creating user: {str(e)}")
        return jsonify({"error": f"Error creating user: {str(e)}"}), 500

# Challenge endpoints
@app.route("/challenges/<challenge_id>")
def get_challenge(challenge_id):
    challenge = db.challenges.find_one({"challenge_id": challenge_id})
    if not challenge:
        return jsonify({"error": "Challenge not found"}), 404
    
    # Get creator information
    creator_id = parse_objectid(challenge.get("creator_id"))
    creator = db.users.find_one({"_id": creator_id}) if creator_id else None
    
    # Format response
    response = {
        "challenge_id": challenge.get("challenge_id"),
        "creator": {
            "username": creator.get("username") if creator else "Unknown",
            "score": creator.get("score", 0) if creator else 0,
            "correct_answers": creator.get("correct_answers", 0) if creator else 0,
            "total_attempts": creator.get("total_attempts", 0) if creator else 0
        },
        "status": challenge.get("status", "created"),
        "opponent_username": challenge.get("opponent_username"),
        "created_at": challenge.get("created_at", datetime.now())
    }
    
    return jsonify(response)

@app.route("/challenges", methods=["POST"])
def create_challenge():
    try:
        # First try to get creator_username from the request body
        data = request.json or {}
        # Then check query parameters if not in body
        creator_username = data.get("creator_username") or request.args.get("creator_username")
        
        if not creator_username:
            return jsonify({"error": "Invalid challenge data, creator_username is required"}), 400
        
        # Get creator user
        creator = db.users.find_one({"username": creator_username})
        if not creator:
            return jsonify({"error": "User not found"}), 404
        
        # Create new challenge
        new_challenge = {
            "challenge_id": str(uuid.uuid4()),
            "creator_id": str(creator["_id"]),
            "status": "created",
            "opponent_id": None,
            "opponent_username": None,
            "created_at": datetime.now()
        }
        
        # Insert challenge
        result = db.challenges.insert_one(new_challenge)
        
        # Return challenge
        created_challenge = db.challenges.find_one({"_id": result.inserted_id})
        
        return jsonify(created_challenge)
    except Exception as e:
        print(f"Error creating challenge: {str(e)}")
        return jsonify({"error": f"Error creating challenge: {str(e)}"}), 500

@app.route("/challenges/<challenge_id>/accept", methods=["POST"])
def accept_challenge(challenge_id):
    try:
        data = request.json
        if not data or "username" not in data:
            return jsonify({"error": "Username is required"}), 400
        
        username = data["username"]
        
        # Check if user exists
        user = db.users.find_one({"username": username})
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Check if challenge exists
        challenge = db.challenges.find_one({"challenge_id": challenge_id})
        if not challenge:
            return jsonify({"error": "Challenge not found"}), 404
        
        # Update challenge
        update_result = db.challenges.update_one(
            {"challenge_id": challenge_id},
            {"$set": {
                "status": "accepted",
                "opponent_id": str(user["_id"]),
                "opponent_username": username
            }}
        )
        
        if update_result.modified_count == 0:
            return jsonify({"error": "Failed to accept challenge"}), 500
        
        # Get updated challenge
        updated_challenge = db.challenges.find_one({"challenge_id": challenge_id})
        
        # Get creator information
        creator_id = parse_objectid(updated_challenge.get("creator_id"))
        creator = db.users.find_one({"_id": creator_id}) if creator_id else None
        
        # Format response
        response = {
            "challenge_id": updated_challenge.get("challenge_id"),
            "creator": {
                "username": creator.get("username") if creator else "Unknown",
                "score": creator.get("score", 0) if creator else 0,
                "correct_answers": creator.get("correct_answers", 0) if creator else 0,
                "total_attempts": creator.get("total_attempts", 0) if creator else 0
            },
            "status": updated_challenge.get("status", "accepted"),
            "opponent_username": updated_challenge.get("opponent_username"),
            "created_at": updated_challenge.get("created_at", datetime.now())
        }
        
        return jsonify(response)
    except Exception as e:
        print(f"Error accepting challenge: {str(e)}")
        return jsonify({"error": f"Error accepting challenge: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True) 