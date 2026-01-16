from datetime import date
from typing import Optional
from pydantic import BaseModel, Field


class EmployeeBase(BaseModel):
    """Atributos de empleado"""
    rut: str = Field(..., min_length=7, max_length=12)
    nombre: str = Field(..., min_length=2, max_length=120)
    fecha_nacimiento: date
    cargo: str = Field(..., min_length=2, max_length=80)
    departamento: str = Field(..., min_length=2, max_length=80)
    fecha_ingreso: date
    activo: bool = True


class EmployeeCreate(EmployeeBase):
    """Schema para crear un empleado con los atributos Base"""
    pass


class EmployeeUpdate(BaseModel):
    """Schema para actualizar un empleado, atributos opcionales"""
    rut: Optional[str] = Field(None, min_length=7, max_length=12)
    nombre: Optional[str] = Field(None, min_length=2, max_length=120)
    fecha_nacimiento: Optional[date] = None
    cargo: Optional[str] = Field(None, min_length=2, max_length=80)
    departamento: Optional[str] = Field(None, min_length=2, max_length=80)
    fecha_ingreso: Optional[date] = None
    activo: Optional[bool] = None


class EmployeeOut(EmployeeBase):
    id: int

    # se puede devolver objetos ORM SQLAlchemy, fastApi lo convierte a JSON usando schema
    model_config = {"from_attributes": True}
