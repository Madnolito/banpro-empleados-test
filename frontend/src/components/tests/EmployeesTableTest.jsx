import { useEffect, useState } from "react";
import { listEmployees } from "../../api/employees";
import EmployeesTable from "./EmployeesTable";

export default function EmployeesTableTest() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const result = await listEmployees({ page: 1, page_size: 10 });
      setData(result);
    } catch (error) {
        setErr("Error en la llamada");
        console.error("Error during preload:", error);
    } finally {
        setLoading(false);
        setIsInitialLoad(false);
    }
  };  

  useEffect(() => {
      if (isInitialLoad) {
          load(); // Carga inicial
      }
  }, [isInitialLoad]);

  return (
    <div style={{ padding: 16, fontFamily: "Arial" }}>
      <h2 style={{ color: 'white'}}>Employees test</h2>

      <button onClick={load} disabled={loading}>
        {loading ? "Cargando..." : "Refrescar"}
      </button>

      {err && (
        <p style={{ color: "crimson", marginTop: 12 }}>
          Error: {err}
        </p>
      )}
        <EmployeesTable data={data} />
    </div>
  );
}
