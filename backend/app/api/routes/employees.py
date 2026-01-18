from typing import List, Optional
import logging
logger = logging.getLogger("app.employees")
from fastapi import APIRouter, Depends, HTTPException, Query # (Depends) inyeccion de dependencias, (Query) validaciones
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.employee import EmployeeCreate, EmployeeOut, EmployeeUpdate
from app.crud.employee import (
    create_employee,
    get_employee_by_rut,
    list_employees,
    get_employee,
    update_employee,
    deactivate_employee,
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

    employee = create_employee(db, payload)
    logger.info("CREATE employee id=%s rut=%s", employee.id, employee.rut)
    return employee


# ----------- PUT employee ----------- 

@router.put("/{employee_id}", response_model=EmployeeOut)
def put_employee(employee_id: int, payload: EmployeeUpdate, db: Session = Depends(get_db)):
    employee = get_employee(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Empleado no encontrado!")

    # si es que manda rut, se valida que no tope con otro
    if payload.rut and payload.rut != employee.rut:
        if get_employee_by_rut(db, payload.rut):
            raise HTTPException(status_code=400, detail="Este RUT ya existe!")

    data = payload.model_dump(exclude_unset=True)
    changed_fields = list(data.keys())

    updated = update_employee(db, employee, payload)
    logger.info("UPDATE employee id=%s fields=%s", employee_id, changed_fields)
    return updated


# ----------- GET details -----------

@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee_detail(employee_id: int, db: Session = Depends(get_db)):
    employee = get_employee(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return employee


# ----------- DELETE -----------

@router.delete("/{employee_id}", response_model=EmployeeOut)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = get_employee(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    deactivated = deactivate_employee(db, employee)
    logger.info("DEACTIVATE employee id=%s", employee_id)
    return deactivated