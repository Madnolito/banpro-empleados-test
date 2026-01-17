from datetime import date
from typing import Optional
from pydantic import BaseModel, Field, field_validator
from app.utils.rut_validator import normalize_and_validate_rut


class EmployeeBase(BaseModel):
    """Atributos de empleado"""
    rut: str = Field(..., min_length=7, max_length=12)
    nombre: str = Field(..., min_length=2, max_length=120)
    fecha_nacimiento: date
    cargo: str = Field(..., min_length=2, max_length=80)
    departamento: str = Field(..., min_length=2, max_length=80)
    fecha_ingreso: date
    activo: bool = True

    @field_validator("rut")
    @classmethod
    def validate_rut(cls, v: str) -> str:
        # devuelve el rut normalizado (ej: 12.345.678-5 -> 12345678-5)
        return normalize_and_validate_rut(v)    


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

    @field_validator("rut")
    @classmethod
    def validate_rut(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        return normalize_and_validate_rut(v)    


class EmployeeOut(EmployeeBase):
    id: int

    # se puede devolver objetos ORM SQLAlchemy, fastApi lo convierte a JSON usando schema
    model_config = {"from_attributes": True}
