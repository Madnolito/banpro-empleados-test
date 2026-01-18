import React from "react";

function getItems(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.results)) return data.results; // por si tu API usa results
  return [];
}

export default function EmployeesTable({ data }) {
  const items = getItems(data);

  if (!data) return <p>Sin datos aún</p>;
  if (items.length === 0) return <p>No hay resultados</p>;

  // columnas automáticas (keys del primer item)
  const columns = Object.keys(items[0] ?? {});

  const renderCell = (value) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Sí" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div style={{ marginTop: 12, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  textAlign: "left",
                  padding: "10px 8px",
                  borderBottom: "1px solid #ddd",
                  background: "#f6f6f6",
                  color: 'black',
                  whiteSpace: "nowrap",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {items.map((row, idx) => (
            <tr key={row.id ?? idx}>
              {columns.map((col) => (
                <td
                  key={col}
                  style={{
                    color:'white',
                    padding: "10px 8px",
                    borderBottom: "1px solid #eee",
                    verticalAlign: "top",
                    whiteSpace: "nowrap",
                  }}
                >
                  {renderCell(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* opcional: info de paginación si viene */}
      {!Array.isArray(data) && (data.total || data.page || data.page_size) ? (
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
          {typeof data.total !== "undefined" ? `Total: ${data.total} · ` : ""}
          {typeof data.page !== "undefined" ? `Page: ${data.page} · ` : ""}
          {typeof data.page_size !== "undefined" ? `Page size: ${data.page_size}` : ""}
        </div>
      ) : null}
    </div>
  );
}
