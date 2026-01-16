from fastapi import FastAPI
from app.core.config import settings
from app.db.init_db import init_db
from app.api.routes.employees import router as employees_router

app = FastAPI(title="BANPRO Employees API", version="0.0.2",)

@app.on_event("startup")
def on_startup():
    # Valida DB y tablas
    init_db()


app.include_router(employees_router)    


# TESTS
@app.get("/test/env")
def test_env():
    return {"env": settings.ENV}