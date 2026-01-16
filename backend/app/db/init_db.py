from app.db.base import Base
from app.db.session import engine

# Import de modelos para base.metadata
from app.models.employee import Employee


def init_db() -> None:
    """
    Crea tablas en la DB, si la tabla existe no la crea
    """
    Base.metadata.create_all(bind=engine)