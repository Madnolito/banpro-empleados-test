import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmployeeDialog from "./EmployeeDialog";

// mock de hooks (no es api real)
const mutateMock = vi.fn();

vi.mock("../hooks/useEmployees", () => ({
  useCreateEmployee: () => ({ mutate: mutateMock, isPending: false, error: null }),
  useUpdateEmployee: () => ({ mutate: vi.fn(), isPending: false, error: null }),
  useEmployee: () => ({ data: null, isLoading: false }),
}));

// mock de utils rut
vi.mock("../utils/EmployeeUtils", () => ({
  cleanRut: (v) => v,
  formatRutIfComplete: (v) => v,
  isRutValidFinal: () => true,
}));

describe("EmployeeDialog", () => {
  beforeEach(() => {
    mutateMock.mockClear();
  });

  it("en modo create: completa formulario y llama create.mutate al guardar", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <EmployeeDialog
        open
        mode="create"
        employeeId={null}
        row={null}
        onClose={onClose}
      />
    );

    // test titulo
    expect(screen.getByText("Crear empleado")).toBeInTheDocument();

    // Completa campos
    // escribe y luego format con blur 
    const rutInput = screen.getByLabelText("RUT");
    await user.type(rutInput, "20243031-7"); 
    await user.tab();
    await user.type(screen.getByLabelText("Nombre"), "Manu Tapia");
    await user.type(screen.getByLabelText("Departamento"), "TI");
    await user.type(screen.getByLabelText("Cargo"), "Dev");
    await user.type(screen.getByLabelText("Fecha nacimiento"), "1999-11-10");
    await user.type(screen.getByLabelText("Fecha ingreso"), "2026-01-19");

    // guardar
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    // payload del form
    expect(mutateMock).toHaveBeenCalledTimes(1);

    const [values, options] = mutateMock.mock.calls[0];

    expect(values).toMatchObject({
      rut: "20243031-7",
      nombre: "Manu Tapia",
      departamento: "TI",
      cargo: "Dev",
      fecha_nacimiento: "1999-11-10",
      fecha_ingreso: "2026-01-19",
      activo: true,
    });

    // onSuccess que cierra el modal
    expect(options).toHaveProperty("onSuccess");
    expect(typeof options.onSuccess).toBe("function");
  });
});
