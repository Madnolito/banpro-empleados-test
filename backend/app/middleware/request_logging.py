import time
import logging
from http import HTTPStatus

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("app.requests")

def _reason_phrase(status_code: int) -> str:
    try:
        return HTTPStatus(status_code).phrase
    except ValueError:
        return ""
    
class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Log simple por request:
    METHOD PATH
    """
    async def dispatch(self, request: Request, call_next):
        start = time.perf_counter()
        logger.info("START %s %s", request.method, request.url.path)

        try:
            response = await call_next(request)
            elapsed_ms = (time.perf_counter() - start) * 1000

            phrase = _reason_phrase(response.status_code)            
            if phrase:
                logger.info(
                    "END   %s %s -> %s %s (%.1fms)",
                    request.method, request.url.path, response.status_code, phrase, elapsed_ms
                )
            else:
                logger.info(
                    "END   %s %s -> %s (%.1fms)",
                    request.method, request.url.path, response.status_code, elapsed_ms
                )

            return response
        except Exception:
            # Log del error (stacktrace)
            elapsed_ms = (time.perf_counter() - start) * 1000
            logger.exception("ERROR %s %s (%0.1fms)", request.method, request.url.path, elapsed_ms)
            # Log del END aun que falle
            phrase = _reason_phrase(500)
            logger.info(
                "END   %s %s -> 500 %s (%.1fms)",
                request.method, request.url.path, phrase, elapsed_ms
            )
            raise
