import { useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  Typography,
  Tooltip,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { useEmployeesList, useDeactivateEmployee } from "../hooks/useEmployees";
import EmployeeDialog from "./EmployeeDialog";
import ConfirmDialog from "./ConfirmDialog";
import { cleanRut, formatRutIfComplete, isRutValidFinal } from "../utils/EmployeeUtils";

export default function EmployeesTable() {
  // MUI TablePagination es 0-based
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const MAX_TEXT = 20;
  // Draft de boton Aplicar
  const [draft, setDraft] = useState({
    rut: "",
    nombre: "",
    departamento: "",
    cargo: "",
    activo: "", // "", "true", "false"
    q: "",
  });

  const [errors, setErrors] = useState({
    rut: "",
    departamento: "",
    q: "",
  });

  const [applied, setApplied] = useState({
    rut: "",
    nombre: "",
    departamento: "",
    cargo: "",
    activo: "",
    q: "",
  });

  // Modal state
  const [dialog, setDialog] = useState({
    open: false,
    mode: "create", // create-edit-detail
    employeeId: null,
    row: null,
  });

  const [confirm, setConfirm] = useState({
    open: false,
    employeeId: null,
    name: "",
  });

  const params = useMemo(() => {
    const p = { page: page + 1, page_size: pageSize }; // backend 1-based
    if (applied.rut.trim()) p.rut = applied.rut.trim();
    if (applied.nombre.trim()) p.nombre = applied.nombre.trim();
    if (applied.departamento.trim()) p.departamento = applied.departamento.trim();
    if (applied.cargo.trim()) p.cargo = applied.cargo.trim();
    if (applied.activo !== "") p.activo = applied.activo === "true";
    if (applied.q.trim()) p.q = applied.q.trim();
    return p;
  }, [page, pageSize, applied]);

  const { data, isLoading, isError, error } = useEmployeesList(params);
  const rows = Array.isArray(data) ? data : [];

  const deactivate = useDeactivateEmployee();

  // si hay next pagina
  const hasNext = rows.length === pageSize;

  const onApply = () => {
    // normaliza rut por si no esta con guion
    const cleaned = cleanRut(draft.rut);
    const rutFinal = formatRutIfComplete(cleaned, true);

    const newErrors = { rut: "", departamento: "", q: "" };

    // valida rut final
    if (!isRutValidFinal(rutFinal)) {
      newErrors.rut = 'RUT inválido. Formato esperado: 20232232-2';
    }

    // valida el max de caract porsiacaso
    if ((draft.departamento || "").length > MAX_TEXT) {
      newErrors.departamento = "Máximo 25 caracteres";
    }
    if ((draft.q || "").length > MAX_TEXT) {
      newErrors.q = "Máximo 25 caracteres";
    }

    setErrors(newErrors);

    // si hay errores no aplica
    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    // aplicar + reset page
    setApplied({ ...draft, rut: rutFinal });
    setPage(0);
  };

  const onClear = () => {
    const cleared = { rut: "", nombre: "", departamento: "", cargo:"", activo: "", q: "" };
    setDraft(cleared);
    setApplied(cleared);
    setPage(0);
  };

  const openCreate = () => setDialog({ open: true, mode: "create", employeeId: null, row: null });
  const openDetail = (row) => setDialog({ open: true, mode: "detail", employeeId: row.id, row });
  const openEdit = (row) => setDialog({ open: true, mode: "edit", employeeId: row.id, row });
  const closeDialog = () => setDialog((d) => ({ ...d, open: false }));

  const openDeactivateConfirm = (row) => {
    setConfirm({ open: true, employeeId: row.id, name: row.nombre ?? "" });
  };
  const closeConfirm = () => setConfirm({ open: false, employeeId: null, name: "" });

  const doDeactivate = () => {
    const id = confirm.employeeId;
    if (!id) return;

    deactivate.mutate(id, {
      onSuccess: () => closeConfirm(),
    });
  };

  const handleRutChange = (e) => {
    const cleaned = cleanRut(e.target.value);
    const formatted = formatRutIfComplete(cleaned, false); // auto a 9
    setDraft((d) => ({ ...d, rut: formatted }));
    setErrors((er) => ({ ...er, rut: "" }));
  };

  const handleRutBlur = () => {
    const cleaned = cleanRut(draft.rut);
    const formatted = formatRutIfComplete(cleaned, true); // se fuerza 8 
    setDraft((d) => ({ ...d, rut: formatted }));
  };  

  const handleDeptChange = (e) => {
    const v = e.target.value.slice(0, MAX_TEXT);
    setDraft((d) => ({ ...d, departamento: v }));
    setErrors((er) => ({ ...er, departamento: "" }));
  };

  const handleQChange = (e) => {
    const v = e.target.value.slice(0, MAX_TEXT);
    setDraft((d) => ({ ...d, q: v }));
    setErrors((er) => ({ ...er, q: "" }));
  };  

  return (
    <Box sx={{ p: 6 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: '500'}}>
          Gestión de empleados
        </Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Añadir empleado
        </Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f7f8fa9d' }}>

        {/* Header filtros */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <TuneRoundedIcon sx={{ color: "black" }} />
          <Box>
            <Typography sx={{ fontWeight: 800, lineHeight: 1 }}>
              Filtros
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Ajusta los filtros y aplica
            </Typography>
          </Box>
        </Stack>        
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="RUT"
            value={draft.rut}
            onChange={handleRutChange}
            onBlur={handleRutBlur}
            error={!!errors.rut}
            helperText={errors.rut || "Ej: 20232232-2"}
            fullWidth
          />
          <TextField
            label="Departamento"
            value={draft.departamento}
            onChange={handleDeptChange}
            error={!!errors.departamento}
            helperText={errors.departamento || "Máx 20 caracteres"}
            slotProps={{
              htmlInput: { maxLength: 20 },
            }}
            fullWidth
          />
          <TextField
            label="Activo"
            select
            value={draft.activo}
            onChange={(e) => setDraft((d) => ({ ...d, activo: e.target.value }))}
            fullWidth
          >
            <MenuItem value="true">Activo</MenuItem>
            <MenuItem value="false">Inactivo</MenuItem>
          </TextField>
          <TextField
            label="Búsqueda (q)"
            value={draft.q}
            onChange={handleQChange}
            error={!!errors.q}
            helperText={errors.q || "Máx 20 caracteres"}
            slotProps={{
              htmlInput: { maxLength: 20 },
            }}
            fullWidth
          />

          <Stack direction="row" spacing={1} sx={{ alignSelf: { md: "center" } }}>
            <Button variant="contained" onClick={onApply}>Aplicar</Button>
            <Button variant="outlined" onClick={onClear}>Limpiar</Button>
          </Stack>
        </Stack>
      </Paper>

      {isError && <Alert severity="error">Error: {String(error?.message ?? error)}</Alert>}

      <TableContainer component={Paper} sx={{ backgroundColor: '#f7f8fa9d'}}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>RUT</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>F. Nac</TableCell>
              <TableCell>F. Ing</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={9}>Cargando...</TableCell>
              </TableRow>
            )}

            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={9}>Sin resultados</TableCell>
              </TableRow>
            )}

            {rows.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.rut}</TableCell>
                <TableCell>{r.nombre}</TableCell>
                <TableCell>{r.departamento}</TableCell>
                <TableCell>{r.cargo}</TableCell>
                <TableCell>{r.fecha_nacimiento}</TableCell>
                <TableCell>{r.fecha_ingreso}</TableCell>
                <TableCell>{String(r.activo)}</TableCell>

                <TableCell align="right">
                  <Tooltip title="Ver detalle">
                    <IconButton onClick={() => openDetail(r)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEdit(r)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={r.activo ? "Dar de baja" : "Ya está inactivo"}>
                    <span>
                      <IconButton
                        disabled={!r.activo}
                        onClick={() => openDeactivateConfirm(r)}
                      >
                        <BlockIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={hasNext ? (page + 2) * pageSize : page * pageSize + rows.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            setPageSize(Number.parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </TableContainer>

      {/* Dialog */}
      <EmployeeDialog
        open={dialog.open}
        mode={dialog.mode}
        employeeId={dialog.employeeId}
        row={dialog.row}
        onClose={closeDialog}
      />

      {/* Confirmar Deactivate */}
      <ConfirmDialog
        open={confirm.open}
        title="Dar de baja empleado"
        description={`¿Seguro que quieres dar de baja a ${confirm.name || "este empleado"}?`}
        onCancel={closeConfirm}
        onConfirm={doDeactivate}
        confirmText="Dar de baja"
        busy={deactivate.isPending}
      />
    </Box>
  );
}
