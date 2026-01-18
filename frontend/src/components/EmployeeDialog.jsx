import { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import { useForm, Controller  } from "react-hook-form";
import { useCreateEmployee, useEmployee, useUpdateEmployee } from "../hooks/useEmployees";
import PropTypes from "prop-types";
import { cleanRut, formatRutIfComplete, isRutValidFinal } from "../utils/EmployeeUtils";

const empty = {
  rut: "",
  nombre: "",
  fecha_nacimiento: "",
  fecha_ingreso: "",
  cargo: "",
  departamento: "",
  activo: true,
};

export default function EmployeeDialog({
  open,
  mode, // "create" | "edit" | "detail"
  employeeId,
  row, // row de la tabla (opcional)
  onClose,
}) {
  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isDetail = mode === "detail";

  // Para detail/edit: traemos el employee por id SOLO si el modal está abierto
  const detailEnabled = open && !!employeeId && (isEdit || isDetail);
  const { data: employee, isLoading: loadingEmployee } = useEmployee(employeeId, detailEnabled);
  const toBool = (v) => v === true || v === "true" || v === 1 || v === "1";
  const createMut = useCreateEmployee();
  const updateMut = useUpdateEmployee(employeeId);

  const busy = createMut.isPending || updateMut.isPending;

  const title = useMemo(() => {
    if (isCreate) return "Crear empleado";
    if (isEdit) return `Editar empleado #${employeeId}`;
    return `Detalle empleado #${employeeId}`;
  }, [isCreate, isEdit, employeeId]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: empty,
    mode: "onChange",        // valida mientras escribe
    reValidateMode: "onChange",
  });

  // Precarga inteligente:
  // - Si hay row, lo usamos altiro (modal rápido)
  // - Si llega employee desde API, lo dejamos como fuente de verdad
  useEffect(() => {
    if (!open) return;

    if (isCreate) {
      reset(empty);
      return;
    }

    const source = employee ?? row;
    if (source) {
      reset({
        rut: source.rut ?? "",
        nombre: source.nombre ?? "",
        fecha_nacimiento: source.fecha_nacimiento ?? "",
        fecha_ingreso: source.fecha_ingreso ?? "",
        cargo: source.cargo ?? "",
        departamento: source.departamento ?? "",
        activo: toBool(source.activo),
      });
    }
  }, [open, isCreate, employee, row, reset]);

  const onSubmit = (values) => {
    if (isDetail) return;

    if (isCreate) {
      createMut.mutate(values, {
        onSuccess: () => onClose?.(),
      });
    } else {
      updateMut.mutate(values, {
        onSuccess: () => onClose?.(),
      });
    }
  };

  const apiError = createMut.error || updateMut.error;
  const readOnly = isDetail;

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {(isEdit || isDetail) && loadingEmployee && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <span>Cargando datos...</span>
            </Stack>
          )}

          {apiError && <Alert severity="error">{String(apiError?.message ?? apiError)}</Alert>}

          <Controller
            name="rut"
            control={control}
            rules={{
              required: "RUT requerido",
              validate: (v) => isRutValidFinal(v) || 'RUT inválido. Ej: 20232232-2',
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="RUT"
                fullWidth
                disabled={readOnly || busy}
                value={field.value ?? ""}
                onChange={(e) => {
                  // mientras escribe auto-formatea
                  const cleaned = cleanRut(e.target.value);                 
                  const formatted = formatRutIfComplete(cleaned, false);    // auto a XXXXXXXX-D 
                  field.onChange(formatted);
                }}
                onBlur={() => {
                  // al salir formatea a XXXXXXX-D
                  const cleaned = cleanRut(field.value ?? "");
                  const formatted = formatRutIfComplete(cleaned, true);
                  field.onChange(formatted);
                  field.onBlur();
                }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message || "Ej: 20232232-2"}
                slotProps={{
                  htmlInput: { maxLength: 10 }, // 8 dígitos + "-" + DV => 10
                }}
              />
            )}
          />
          <TextField
            label="Nombre"
            fullWidth
            disabled={readOnly || busy}
            error={!!errors.nombre}
            helperText={errors.nombre?.message || "Máx 20 caracteres"}
            slotProps={{ htmlInput: { maxLength: 20 } }}
            {...register("nombre", {
              required: "Nombre requerido",
              maxLength: { value: 20, message: "Máximo 20 caracteres" },
              onChange: (e) => (e.target.value = e.target.value.slice(0, 20)),
            })}
          />

          <TextField
            label="Departamento"
            fullWidth
            disabled={readOnly || busy}
            error={!!errors.departamento}
            helperText={errors.departamento?.message || "Máx 20 caracteres"}
            slotProps={{ htmlInput: { maxLength: 20 } }}
            {...register("departamento", {
              required: "Departamento requerido",
              maxLength: { value: 20, message: "Máximo 20 caracteres" },
              onChange: (e) => (e.target.value = e.target.value.slice(0, 20)),
            })}
          />

          <TextField
            label="Cargo"
            fullWidth
            disabled={readOnly || busy}
            error={!!errors.cargo}
            helperText={errors.cargo?.message || "Máx 20 caracteres"}
            slotProps={{ htmlInput: { maxLength: 20 } }}
            {...register("cargo", {
              required: "Cargo requerido",
              maxLength: { value: 20, message: "Máximo 20 caracteres" },
              onChange: (e) => (e.target.value = e.target.value.slice(0, 20)),
            })}
          />

          <TextField
            label="Fecha nacimiento"
            type="date"
            fullWidth
            disabled={readOnly || busy}
            error={!!errors.fecha_nacimiento}
            helperText={errors.fecha_nacimiento?.message}
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("fecha_nacimiento", { required: "Fecha de nacimiento requerida" })}
          />

          <TextField
            label="Fecha ingreso"
            type="date"
            fullWidth
            disabled={readOnly || busy}
            error={!!errors.fecha_ingreso}
            helperText={errors.fecha_ingreso?.message}
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("fecha_ingreso", { required: "Fecha de ingreso requerida" })}
          />

          <Controller
            name="activo"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                label="Activo"
                control={
                  <Checkbox
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={readOnly || busy}
                  />
                }
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          Cerrar
        </Button>

        {!isDetail && (
          <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={busy}>
            {busy ? "Guardando..." : "Guardar"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
EmployeeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(["create", "edit", "detail"]).isRequired,
  employeeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  row: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

EmployeeDialog.defaultProps = {
  employeeId: null,
  row: null,
};