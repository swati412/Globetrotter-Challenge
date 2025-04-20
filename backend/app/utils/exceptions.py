from fastapi import HTTPException
from typing import Optional, Dict, Any

class GlobetrotterException(HTTPException):
    def __init__(
        self, 
        status_code: int, 
        detail: str, 
        error_code: str = None,
        headers: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=status_code, detail=detail, headers=headers)
        self.error_code = error_code

class ResourceNotFoundException(GlobetrotterException):
    """Exception raised when a requested resource is not found"""
    def __init__(self, resource_type: str, detail: str = None):
        message = detail or f"{resource_type} not found"
        super().__init__(status_code=404, detail=message, error_code="RESOURCE_NOT_FOUND")

class DuplicateResourceException(GlobetrotterException):
    """Exception raised when attempting to create a duplicate resource"""
    def __init__(self, resource_type: str, detail: str = None):
        message = detail or f"{resource_type} already exists"
        super().__init__(status_code=409, detail=message, error_code="DUPLICATE_RESOURCE")

class ValidationException(GlobetrotterException):
    """Exception raised for validation errors"""
    def __init__(self, detail: str):
        super().__init__(status_code=422, detail=detail, error_code="VALIDATION_ERROR")

class DatabaseException(GlobetrotterException):
    """Exception raised for database errors"""
    def __init__(self, detail: str = "Database operation failed"):
        super().__init__(status_code=500, detail=detail, error_code="DATABASE_ERROR")

class GameplayException(GlobetrotterException):
    """Exception raised for gameplay-related errors"""
    def __init__(self, detail: str):
        super().__init__(status_code=400, detail=detail, error_code="GAMEPLAY_ERROR")