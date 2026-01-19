import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
} from "../api/employees"; 

export function useEmployeesList(params) {
  return useQuery({
    queryKey: ["employees", "list", params], // QueryKey = ID de la consulta en cache, react Query ve que es otra key hace otra consulta con cache separado
    queryFn: () => listEmployees(params),  // func que trae los datos de AXIOS
    keepPreviousData: true, // clave o flag para la UI especificamente para la tabla, mantiene resultados anteriores mientras llegan los nuevos
  });
}

// detalle del empleado
export function useEmployee(employeeId) {
  return useQuery({
    queryKey: ["employees", "detail", employeeId], 
    queryFn: () => getEmployeeById(employeeId), // func de AXIOS
    enabled: !!employeeId, // evita llamadas si no hay id o modal cerrado
  });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createEmployee(payload), // ejecuta POST
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees", "list"] }), // avisa a React Query que la lista cambio pero el cache tiene lo anterior y hace refresh
  });
}

export function useUpdateEmployee(employeeId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateEmployee(employeeId, payload),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["employees", "list"] }); // al cerrar modal al guardar refresca solo la lista
      qc.setQueryData(["employees", "detail", employeeId], updated);
    }
  });
}

//empleado de activo=false
export function useDeactivateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (employeeId) => deactivateEmployee(employeeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees", "list"] }),
  });
}
