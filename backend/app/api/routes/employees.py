from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query # (Depends) inyeccion de dependencias, (Query) validaciones
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.employee import EmployeeCreate, EmployeeOut
from app.crud.employee import (
    create_employee,
    get_employee_by_rut,
    list_employees,
)

router = APIRouter(prefix="/employees", tags=["employees"])


# ----------- GET employees -----------

@router.get("", response_model=List[EmployeeOut]) # retorna lista de objetos ORM employee y employeeout lo transforma a JSON
def get_employees( # validaciones automaticas
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    rut: Optional[str] = None,
    departamento: Optional[str] = None,
    activo: Optional[bool] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return list_employees(
        db=db,
        page=page,
        page_size=page_size,
        rut=rut,
        departamento=departamento,
        activo=activo,
        q=q,
    )


# ----------- POST employee -----------

@router.post("", response_model=EmployeeOut, status_code=201) # created
def post_employee(payload: EmployeeCreate, db: Session = Depends(get_db)): # valida con employeecreate
    # validacion para evitar duplicado por rut
    if get_employee_by_rut(db, payload.rut):
        raise HTTPException(status_code=400, detail="Este RUT ya existe!")

    return create_employee(db, payload) # db y body

