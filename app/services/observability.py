import logging
import time
from functools import wraps

logger = logging.getLogger("cinemind")
logger.setLevel(logging.INFO)


def log_timing(operation_name):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            started = time.time()
            try:
                result = fn(*args, **kwargs)
                logger.info("operation_completed", extra={"operation": operation_name, "duration_ms": round((time.time() - started) * 1000, 2)})
                return result
            except Exception as exc:
                logger.exception("operation_failed", extra={"operation": operation_name, "error": str(exc)})
                raise
        return wrapper
    return decorator
