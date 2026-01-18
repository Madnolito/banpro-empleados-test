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
    queryKey: ["employees", "list", params], // QueryKey = ID de la consulta en cache, si params cambia significa que es otra consulta
    queryFn: () => listEmployees(params),  // func que trae los datos de AXIOS
    keepPreviousData: true, // clave o flag para la UI especificamente para la tabla, por ejemplo para evitar parpadeos
  });
}

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
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees", "list"] }), // avisa a React Query que la lista cambio y refresh
  });
}

export function useUpdateEmployee(employeeId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateEmployee(employeeId, payload),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["employees", "list"] });
      qc.setQueryData(["employees", "detail", employeeId], updated);
    }
  });
}

export function useDeactivateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (employeeId) => deactivateEmployee(employeeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees", "list"] }),
  });
}
