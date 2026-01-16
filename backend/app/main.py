from fastapi import FastAPI
from app.core.config import settings
from app.db.init_db import init_db

app = FastAPI(title="BANPRO Employees API", version="0.0.2",)

@app.on_event("startup")
def on_startup():
    # Valida DB y tablas
    init_db()

@app.get("/test/env")
def test_env():
    return {"env": settings.ENV}