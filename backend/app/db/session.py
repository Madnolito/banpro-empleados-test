from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import settings

# SQLite check_same_thread=False para usar la conexion en distintas "threads"
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {},
)

# Sesiones hacia la DB
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

def get_db():
    """
    FastAPI:
    - crea sesion por request
    - al final la cierra si o si
    """
    db: Session = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()   
        raise
    finally:
        db.close()
