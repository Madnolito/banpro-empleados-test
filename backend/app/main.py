from fastapi import FastAPI
from app.core.config import settings
from app.db.init_db import init_db
from app.api.routes.employees import router as employees_router
from app.core.logging_config import setup_logging
from app.middleware.request_logging import RequestLoggingMiddleware
from app.core.exception_handlers import add_exception_handlers
from fastapi.middleware.cors import CORSMiddleware

setup_logging()

app = FastAPI(title="BANPRO Employees API", version="0.1.0",)

origins = [
    "http://localhost:5173",  # React + vite frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,   # cookies 
    allow_methods=["*"],      # get + post + put + delete
    allow_headers=["*"],      # Authorization, Content-Type y demas
)

add_exception_handlers(app)
app.add_middleware(RequestLoggingMiddleware)


@app.on_event("startup")
def on_startup():
    # Valida DB y tablas
    init_db()


app.include_router(employees_router)    
