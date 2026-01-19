import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmDialog from "./ConfirmDialog";

// se crean mockups para para capturar llamadas

describe("ConfirmDialog", () => {
  it("muestra contenido, confirma y respeta estado busy", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn(); // func falsa para analizar su comportamiento
    const onConfirm = vi.fn();

    const { rerender } = render(
      <ConfirmDialog
        open
        title="Dar de baja a empleado"
        description="¿Seguro que quieres dar de baja?"
        onCancel={onCancel}
        onConfirm={onConfirm}
        confirmText="Sí, Dar de baja "
        busy={false}
      />
    );

    // render
    expect(screen.getByText("Dar de baja a empleado")).toBeInTheDocument(); // verifica que se este mostrando
    expect(screen.getByText("¿Seguro que quieres dar de baja?")).toBeInTheDocument();

    // confirma
    await user.click(screen.getByRole("button", { name: "Sí, Dar de baja" })); // simula click
    expect(onConfirm).toHaveBeenCalledTimes(1);

    // render busy=true
    rerender(
      <ConfirmDialog
        open
        title="Dar de baja a empleado"
        description="¿Seguro que quieres dar de baja?"
        onCancel={onCancel}
        onConfirm={onConfirm}
        confirmText="Sí, Dar de baja"
        busy
      />
    );

    // botones deshabilitados + texto cambia
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Procesando..." })).toBeDisabled();
  });
});
