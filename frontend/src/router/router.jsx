import { Routes, Route } from "react-router-dom";
import EmployeesTable from "../components/EmployeesTable";

export default function Router() {
  return (
    <Routes>
      <Route index element={<EmployeesTable />} />
      <Route path="*" element={<div style={{ padding: 16 }}>404 not found</div>} />
    </Routes>
  );
}
