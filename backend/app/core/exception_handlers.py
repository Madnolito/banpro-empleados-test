import logging
from fastapi import Request, HTTPException, FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError, OperationalError

logger = logging.getLogger("app.exceptions")


def add_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(HTTPException) # endpoint, servicio, dependencia raise HTTPException 
    async def http_exception_handler(request: Request, exc: HTTPException):
        rid = getattr(request.state, "request_id", "-")

        # loguea el detail 
        logger.warning(
            "rid=%s | HTTPException status=%s detail=%r",
            rid, exc.status_code, exc.detail
        )

        return JSONResponse(
            status_code=exc.status_code,
            content={
                "code": "HTTP_ERROR",
                "detail": exc.detail,
                "request_id": rid,
            },
        )

    @app.exception_handler(IntegrityError) # duplicados, nulls
    async def integrity_error_handler(request: Request, exc: IntegrityError):
        rid = getattr(request.state, "request_id", "-")

        # logea con stacktrace
        logger.exception("rid=%s | IntegrityError", rid)

        return JSONResponse(
            status_code=409,
            content={
                "code": "DB_INTEGRITY_ERROR",
                "detail": "Conflicto en datos.",
                "request_id": rid,
            },
        )

    @app.exception_handler(OperationalError) # problemas de conexion, la db se lockea, error en archivo
    async def operational_error_handler(request: Request, exc: OperationalError):
        rid = getattr(request.state, "request_id", "-")

        logger.exception("rid=%s | OperationalError", rid)

        return JSONResponse(
            status_code=503,
            content={
                "code": "DB_OPERATIONAL_ERROR",
                "detail": "La base de datos no pudo procesar la solicitud, intentalo nuevamente.",
                "request_id": rid,
            },
        )
