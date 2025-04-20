from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.config.settings import settings
from app.utils.database import init_db
from app.routes import destination, user, challenge
from app.utils.exceptions import GlobetrotterException
from app.middleware.error_handler import globetrotter_exception_handler, general_exception_handler
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

app = FastAPI(title=settings.APP_NAME)

# Log the allowed origins for debugging
logging.info(f"Configuring CORS with allowed origins: {settings.ORIGINS}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(GlobetrotterException, globetrotter_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    error_messages = []
    
    for error in errors:
        error_messages.append({
            "field": error["loc"][-1] if error["loc"] else None,
            "message": error["msg"]
        })
    
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request data",
                "details": error_messages
            }
        }
    )

app.include_router(destination.router, prefix="/destinations", tags=["Destinations"])
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(challenge.router, prefix="/challenges", tags=["Challenges"])

@app.on_event("startup")
async def startup_event():
    logging.info(f"Connecting to MongoDB at {settings.MONGO_URI}, database: {settings.DATABASE_NAME}")
    await init_db()
    logging.info("Database connection initialized")

@app.get("/")
async def root():
    return {"message": "Welcome to the Globetrotter API"}

if __name__ == "__main__":
    import uvicorn
    logging.info(f"Starting server on port {settings.PORT}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)