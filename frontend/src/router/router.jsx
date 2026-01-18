import { Routes, Route } from "react-router-dom";
import EmployeesTableTest from "../components/tests/EmployeesTableTest";

export default function Router() {
  return (
        <Routes>
            <Route
                index
                element={
                    <EmployeesTableTest />
                }
            />
            {/* <Route
                path="/Home"
                element={
                    <Home />
                }
            /> */}
        </Routes>
  );
}
