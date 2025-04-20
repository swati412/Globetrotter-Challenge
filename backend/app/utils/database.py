from motor.motor_asyncio import AsyncIOMotorClient
from ..config.settings import settings
import json
import os
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Initialize MongoDB connection
try:
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]
    
    destinations_collection = db.destinations
    users_collection = db.users
    challenges_collection = db.challenges
except Exception as e:
    logger.error(f"Failed to initialize MongoDB connection: {str(e)}")
    raise

async def init_db():
    """
    Initialize database by dropping and recreating all collections.
    Only destinations collection is loaded from JSON file, while users and challenges
    are simply reset as empty collections.
    """
    try:
        # Base directory for data files
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        
        # Reset and initialize destinations collection from JSON
        await reset_destinations_collection(
            collection=destinations_collection,
            json_path=os.path.join(base_dir, "destinations.json")
        )
        
        # Reset users collection (empty)
        await reset_empty_collection(users_collection, "users")
        
        # Reset challenges collection (empty)
        await reset_empty_collection(challenges_collection, "challenges")
        
        logger.info("Database initialization completed successfully")
        
    except Exception as e:
        logger.error(f"Unexpected error in init_db: {str(e)}")
        # Log the error but don't crash the application
        logger.warning("Continuing application startup despite database initialization failure")

async def reset_destinations_collection(collection, json_path):
    """
    Drop and recreate destinations collection from the JSON file.
    
    Args:
        collection: The MongoDB collection object
        json_path: Path to the JSON file with destination data
    """
    try:
        # Drop the collection
        logger.info("Dropping destinations collection")
        await collection.drop()
        
        # Check if JSON file exists and load data
        if os.path.exists(json_path):
            try:
                with open(json_path, "r") as f:
                    destinations = json.load(f)
                
                if destinations and isinstance(destinations, list):
                    logger.info(f"Loaded {len(destinations)} destinations from JSON file")
                    
                    # Insert data into the empty collection
                    await collection.insert_many(destinations)
                    logger.info(f"Inserted {len(destinations)} destinations")
                else:
                    logger.warning("No destinations found in JSON file or invalid format")
            except json.JSONDecodeError as e:
                logger.error(f"Invalid JSON in {json_path}: {str(e)}")
            except Exception as e:
                logger.error(f"Failed to insert destinations: {str(e)}")
        else:
            logger.warning(f"destinations.json not found at {json_path}, created empty collection")
            
    except Exception as e:
        logger.error(f"Failed to reset destinations collection: {str(e)}")

async def reset_empty_collection(collection, collection_name):
    """
    Drop and recreate an empty collection.
    
    Args:
        collection: The MongoDB collection object
        collection_name: Name of the collection (for logging)
    """
    try:
        # Drop the collection
        logger.info(f"Dropping {collection_name} collection")
        await collection.drop()
        
        # Create an empty collection by inserting and then removing a dummy document
        await collection.insert_one({"_id": "temp_doc", "temp": True})
        await collection.delete_one({"_id": "temp_doc"})
        
        logger.info(f"Reset {collection_name} collection to empty state")
            
    except Exception as e:
        logger.error(f"Failed to reset {collection_name} collection: {str(e)}")