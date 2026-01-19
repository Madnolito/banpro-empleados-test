import { api } from "./api";

function getApiErrorMessage(error) {
  return (
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    String(error)
  );
}

// GET /employees?page=1&page_size=10...
export async function listEmployees(params = {}) {
  try {
    const res = await api.get("/employees", { params });
    return res.data;
  } catch (error) {
    console.error("API Error [listEmployees]:", {
      params,
      message: getApiErrorMessage(error),
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw new Error(getApiErrorMessage(error));
  }
}

// GET /employees/{id}
export async function getEmployeeById(employeeId) {
  try {
    const res = await api.get(`/employees/${employeeId}`);
    return res.data;
  } catch (error) {
    console.error("API Error [getEmployeeById]:", {
      employeeId,
      message: getApiErrorMessage(error),
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw new Error(getApiErrorMessage(error));
  }
}

// POST /employees
export async function createEmployee(payload) {
  try {
    const res = await api.post("/employees", payload);
    return res.data;
  } catch (error) {
    console.error("API Error [createEmployee]:", {
      payload,
      message: getApiErrorMessage(error),
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw new Error(getApiErrorMessage(error));
  }
}

// PUT /employees/{id}
export async function updateEmployee(employeeId, payload) {
  try {
    const res = await api.put(`/employees/${employeeId}`, payload);
    return res.data;
  } catch (error) {
    console.error("API Error [updateEmployee]:", {
      employeeId,
      payload,
      message: getApiErrorMessage(error),
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw new Error(getApiErrorMessage(error));
  }
}

// DEACTIVATE /employees/{id} true o false
export async function deactivateEmployee(employeeId) {
  try {
    const res = await api.delete(`/employees/${employeeId}`);
    return res.data;
  } catch (error) {
    console.error("API Error [deactivateEmployee]:", {
      employeeId,
      message: getApiErrorMessage(error),
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw new Error(getApiErrorMessage(error));
  }
}

// DELETE /employees/{id} true o false
// export async function deleteEmployee(employeeId) {
//   try {
//     const res = await api.delete(`/employees/${employeeId}`);
//     return res.data;
//   } catch (error) {
//     console.error("API Error [deleteEmployee]:", {
//       employeeId,
//       message: getApiErrorMessage(error),
//       status: error?.response?.status,
//       data: error?.response?.data,
//     });
//     throw new Error(getApiErrorMessage(error));
//   }
// }
