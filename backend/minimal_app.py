from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
from bson import ObjectId
import json
import random

# Configuration
DATABASE_NAME = os.getenv("DATABASE_NAME", "globetrotter")
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# Create Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}})

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
        return super().default(obj)

app.json_encoder = CustomJSONEncoder

# Basic API endpoints
@app.route("/")
def root():
    return jsonify({"message": "Welcome to the Globetrotter API"})

@app.route("/destinations")
def get_destinations():
    destinations = list(db.destinations.find(limit=100))
    return jsonify(destinations)

@app.route("/destinations/random")
def get_random_destination():
    # Count total destinations
    count = db.destinations.count_documents({})
    if count == 0:
        return jsonify({"error": "No destinations found"}), 404
    
    # Get a random destination
    try:
        # Skip a random number of documents
        random_skip = random.randint(0, count - 1)
        destination = db.destinations.find().skip(random_skip).limit(1)[0]
        return jsonify(destination)
    except Exception as e:
        print(f"Error fetching random destination: {str(e)}")
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

@app.route("/users/<username>")
def get_user(username):
    user = db.users.find_one({"username": username})
    if not user:
        return jsonify({"exists": False})
    
    return jsonify({"exists": True, "user": user})

@app.route("/users", methods=["POST"])
def create_user():
    user_data = request.json
    
    # Check if username already exists
    existing_user = db.users.find_one({"username": user_data["username"]})
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400
    
    # Insert new user
    result = db.users.insert_one(user_data)
    
    # Return created user
    created_user = db.users.find_one({"_id": result.inserted_id})
    
    return jsonify(created_user)

@app.route("/challenges/<challenge_id>")
def get_challenge(challenge_id):
    obj_id = parse_objectid(challenge_id)
    if not obj_id:
        return jsonify({"error": "Invalid ID format"}), 400
    
    challenge = db.challenges.find_one({"_id": obj_id})
    if not challenge:
        return jsonify({"error": "Challenge not found"}), 404
    
    return jsonify(challenge)

@app.route("/challenges", methods=["POST"])
def create_challenge():
    challenge_data = request.json
    result = db.challenges.insert_one(challenge_data)
    
    # Return created challenge
    created_challenge = db.challenges.find_one({"_id": result.inserted_id})
    
    return jsonify(created_challenge)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    app.run(host="0.0.0.0", port=port) 