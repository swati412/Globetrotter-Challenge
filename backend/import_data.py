import json
import os
from pymongo import MongoClient
from bson import ObjectId

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://swati412:swati%401234@cluster0.uj92us8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DATABASE_NAME = os.getenv("DATABASE_NAME", "globetrotter")

# Connect to MongoDB
try:
    print("Connecting to MongoDB...")
    client = MongoClient(MONGO_URL)
    db = client[DATABASE_NAME]
    print(f"Connected to MongoDB: {DATABASE_NAME}")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    exit(1)

# Load destinations from JSON file
try:
    print("Loading destinations.json...")
    with open('destinations.json', 'r') as f:
        destinations = json.load(f)
    print(f"Loaded {len(destinations)} destinations from JSON")
except Exception as e:
    print(f"Error loading destinations.json: {e}")
    exit(1)

# Check if destinations collection is empty
destinations_count = db.destinations.count_documents({})
print(f"Current destinations in database: {destinations_count}")

if destinations_count > 0:
    confirm = input("Destinations collection is not empty. Do you want to clear it and import new data? (y/n): ")
    if confirm.lower() != 'y':
        print("Import cancelled.")
        exit(0)
    
    # Clear destinations collection
    db.destinations.delete_many({})
    print("Cleared destinations collection.")

# Insert destinations into MongoDB
try:
    print("Inserting destinations into MongoDB...")
    
    # Make sure each destination has a valid _id field (ObjectId)
    for destination in destinations:
        if '_id' in destination and isinstance(destination['_id'], str):
            # If _id exists and is a string, convert it to ObjectId
            try:
                destination['_id'] = ObjectId(destination['_id'])
            except:
                # If conversion fails, remove _id to let MongoDB generate a new one
                del destination['_id']
    
    # Insert all destinations
    result = db.destinations.insert_many(destinations)
    print(f"Successfully inserted {len(result.inserted_ids)} destinations into MongoDB")
except Exception as e:
    print(f"Error inserting destinations into MongoDB: {e}")
    exit(1)

print("Data import completed successfully!") 