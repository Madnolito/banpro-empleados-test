from sqlalchemy import Boolean, Date, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

class Employee(Base):
    """
    Modelo ORM <tabla> empleados - crear/consultar
    """
    __tablename__ = "employees" # Nombre real de tabla en DB

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    rut: Mapped[str] = mapped_column(String(12), unique=True, index=True, nullable=False)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)

    fecha_nacimiento: Mapped["Date"] = mapped_column(Date, nullable=False)

    cargo: Mapped[str] = mapped_column(String(80), nullable=False)
    departamento: Mapped[str] = mapped_column(String(80), index=True, nullable=False)

    fecha_ingreso: Mapped["Date"] = mapped_column(Date, nullable=False)

    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
