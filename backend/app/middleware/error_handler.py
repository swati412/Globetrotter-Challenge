from fastapi import Request
from fastapi.responses import JSONResponse
from ..utils.exceptions import GlobetrotterException
import logging

logger = logging.getLogger(__name__)

async def globetrotter_exception_handler(request: Request, exc: GlobetrotterException):
    logger.error(f"GlobetrotterException: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.error_code or "UNKNOWN_ERROR",
                "message": exc.detail
            }
        }
    )

async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred"
            }
        }
    )