// src/components/GestionesAdmin/RepuestosTable.jsx
import React, { useMemo } from "react";
import "./GestionesAdmin.css";

const sample = [
  { id: 1, nombre: "Batería Bosch 12V", stock: 12, estado: "Activo", detalle: "12V, 50Ah", fecha: "2025-10-01" },
  { id: 2, nombre: "Pastillas de freno", stock: 3, estado: "Pendiente", detalle: "Delanteras", fecha: "2025-09-25" },
  { id: 3, nombre: "Aceite 10W-40", stock: 20, estado: "Activo", detalle: "5L", fecha: "2025-10-02" },
  { id: 4, nombre: "Filtro de aire", stock: 0, estado: "Pendiente", detalle: "Audi / VW", fecha: "2025-10-10" },
  { id: 5, nombre: "Correa de distribución", stock: 2, estado: "Confirmado", detalle: "Kit completo", fecha: "2025-10-12" },
  { id: 6, nombre: "Bujía NGK", stock: 40, estado: "Activo", detalle: "Iridium", fecha: "2025-10-14" },
];

const RepuestosTable = ({ filters }) => {
  const { search = "", statusFilter = "", dateFrom = "", dateTo = "" } = filters || {};

  const filtered = useMemo(() => {
    return sample.filter(r => {
      const matchesSearch = !search || r.nombre.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || r.estado === statusFilter;
      const matchesFrom = !dateFrom || new Date(r.fecha) >= new Date(dateFrom);
      const matchesTo = !dateTo || new Date(r.fecha) <= new Date(dateTo);
      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [search, statusFilter, dateFrom, dateTo]);

  const pageSize = 5;
  const [page, setPage] = React.useState(1);
  const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="data-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Stock</th>
            <th>Detalle</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 && <tr><td colSpan="6" style={{textAlign:'center', padding:24}}>No hay resultados</td></tr>}
          {paged.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.nombre}</td>
              <td>{r.stock}</td>
              <td>{r.detalle}</td>
              <td>{r.fecha}</td>
              <td>
                <button className="btn-ver">Ver</button>
                <button className="btn-editar">Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <div className="rows-info">Mostrando {paged.length} de {filtered.length}</div>
        <div className="pagination">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>{"<"}</button>
          {[...Array(Math.min(5, maxPage)).keys()].map(i => (
            <button key={i} onClick={() => setPage(i+1)} className={page === i+1 ? "active": ""}>{i+1}</button>
          ))}
          {maxPage > 5 && <span className="dots">...{maxPage}</span>}
          <button onClick={() => setPage(p => Math.min(maxPage, p+1))} disabled={page === maxPage}>{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default RepuestosTable;
