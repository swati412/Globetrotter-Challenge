import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Globetrotter API"
    MONGO_URI: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = "globetrotter"
    ORIGINS: list = ["*"]

    class Config:
        env_file = ".env"

settings = Settings()