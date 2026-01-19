from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.employee import Employee #tabla sqlite
from app.schemas.employee import EmployeeCreate, EmployeeUpdate


def create_employee(db: Session, payload: EmployeeCreate) -> Employee:
    """
    Crea empleado en DB
    """
    employee = Employee(**payload.model_dump()) # dict Python
    db.add(employee)
    db.commit() # insert
    db.refresh(employee)  # obtiene id generado y valores finales desde la DB
    return employee


def get_employee(db: Session, employee_id: int) -> Optional[Employee]:
    """
    Get empleado por ID, si no existe retorna none
    """
    return db.get(Employee, employee_id) # retorna por primary key


def get_employee_by_rut(db: Session, rut: str) -> Optional[Employee]:
    """
    Get empleado por RUT, si no existe retorna none
    """
    stmt = select(Employee).where(Employee.rut == rut) # query
    return db.execute(stmt).scalars().first() # objetos en vez de filas


def list_employees(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    rut: Optional[str] = None,
    nombre: Optional[str] = None,
    departamento: Optional[str] = None,
    cargo: Optional[str] = None,
    activo: Optional[bool] = None,
    q: Optional[str] = None,
) -> List[Employee]:
    """
    Lista empleados con filtros + busqueda + paginacion
    """
    stmt = select(Employee) # query 

    if rut:
        stmt = stmt.where(Employee.rut == rut)
    if nombre:
        stmt = stmt.where(Employee.nombre.ilike(nombre))        
    if departamento:
        stmt = stmt.where(Employee.departamento.ilike(departamento))
    if cargo:
        stmt = stmt.where(Employee.cargo.ilike(cargo))        
    if activo is not None:
        stmt = stmt.where(Employee.activo == activo)

    if q:
        q_like = f"%{q}%"
        stmt = stmt.where(
            (Employee.rut.ilike(q_like)) | (Employee.nombre.ilike(q_like)) | (Employee.departamento.ilike(q_like)) | (Employee.cargo.ilike(q_like)) # busca rut, depa, nom, cargo
        )

    offset = (page - 1) * page_size
    stmt = stmt.offset(offset).limit(page_size) # paginacion

    return db.execute(stmt).scalars().all()


def update_employee(db: Session, employee: Employee, payload: EmployeeUpdate) -> Employee:
    """
    UPDT empleado que ya existe
    """
    data = payload.model_dump(exclude_unset=True) # solo datos enviados
    for key, value in data.items():
        setattr(employee, key, value) # actualiza dinamicamente

    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee # actualizado


def deactivate_employee(db: Session, employee: Employee) -> Employee:
    """
    Deja empleado inactivo
    """
    employee.activo = False
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee

# def delete_employee(db: Session, employee: Employee) -> Employee:
#     db.delete(employee)
#     db.commit()
#     return employee
