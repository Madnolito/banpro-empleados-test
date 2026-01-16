from fastapi import FastAPI, Depends
from app.core.config import settings
from sqlalchemy.orm import Session
from app.db.session import get_db
app = FastAPI(title="BANPRO Employees API", version="0.0.1",)

@app.get("/test/env")
def test_env(db: Session = Depends(get_db)):
    return {"env": settings.ENV, "db_ok": True}