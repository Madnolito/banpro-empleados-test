from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(
    title="BANPRO Employees API",
    version="0.0.1",
)


@app.get("/test/env")
def health():
    return {"status": "ok", "env": settings.ENV}