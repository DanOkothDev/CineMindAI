from typing import Any


class ApiError(Exception):
    def __init__(self, message: str, status_code: int = 400, data: Any = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.data = data


class BadRequestError(ApiError):
    def __init__(self, message: str, data: Any = None):
        super().__init__(message, status_code=400, data=data)


class NotFoundError(ApiError):
    def __init__(self, message: str, data: Any = None):
        super().__init__(message, status_code=404, data=data)


class DatabaseError(ApiError):
    def __init__(self, message: str = "Database error", data: Any = None):
        super().__init__(message, status_code=500, data=data)
