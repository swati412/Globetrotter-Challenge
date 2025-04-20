import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Globetrotter API"
    MONGO_URI: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "globetrotter")
    
    # Default origins for local development
    DEFAULT_ORIGINS = [
        "http://localhost:5173",  # Frontend local dev
        "http://localhost:3000",  # Common alternate port
    ]
    
    # Get the ORIGINS from environment or use defaults
    # In production, add your Vercel domain(s) to ALLOWED_ORIGINS env var
    ORIGINS: list = os.getenv("ALLOWED_ORIGINS", ",".join(DEFAULT_ORIGINS)).split(",")
    
    # For deployment on platforms that assign dynamic ports
    PORT: int = int(os.getenv("PORT", "8000"))

    class Config:
        env_file = ".env"

settings = Settings()