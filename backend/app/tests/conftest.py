import os
import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

# Asegura que settings lea esta DB para tests - se fuerzan var de entorno
TEST_DB_URL = "sqlite:///./test_banpro.db"
os.environ["DATABASE_URL"] = TEST_DB_URL
os.environ["ENV"] = "test"

from app.main import app  
from app.db.base import Base  
from app.db.session import get_db  


engine = create_engine( # conexion base a SQLite
    TEST_DB_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # tests obtienen una session cada uno para hacer operaciones


@pytest.fixture(scope="session", autouse=True)
def create_test_db(): 
    # crea el esquema o tablas en la DB de test
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db_session():
    db = TestingSessionLocal()
    try:
        # clear para evitar choques de datos entre tests
        db.execute(text("DELETE FROM employees"))
        db.commit()
        yield db
    finally:
        db.close()


@pytest.fixture()
def client(db_session):
    # override de dependencia get_db para session de test
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()
