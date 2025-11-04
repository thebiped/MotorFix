// src/components/GestionesAdmin/ClientesTable.jsx
import React, { useMemo, useState } from "react";
import "./GestionesAdmin.css";

const sample = [
  { id: 1, nombre: "Juan Pérez", detalle: "Cambio de aceite", estado: "Activo", fecha: "2025-10-20" },
  { id: 2, nombre: "María Gómez", detalle: "Revisión general", estado: "Pendiente", fecha: "2025-10-22" },
  { id: 3, nombre: "Carlos Díaz", detalle: "Frenos", estado: "Completado", fecha: "2025-09-30" },
  { id: 4, nombre: "Lucía Morales", detalle: "Alineación", estado: "Activo", fecha: "2025-10-02" },
  { id: 5, nombre: "Pedro Ruiz", detalle: "Inyección", estado: "Pendiente", fecha: "2025-10-10" },
  { id: 6, nombre: "Ana Torres", detalle: "Batería", estado: "Confirmado", fecha: "2025-10-12" },
  { id: 7, nombre: "Rodolfo Pérez", detalle: "Filtro", estado: "Activo", fecha: "2025-10-14" },
  // ... más para paginar
];

const usePagination = (items, pageSize) => {
  const [page, setPage] = useState(1);
  const maxPage = Math.max(1, Math.ceil(items.length / pageSize));
  const paged = items.slice((page - 1) * pageSize, page * pageSize);
  return { page, setPage, paged, maxPage };
};

const ClientesTable = ({ filters }) => {
  const { search = "", statusFilter = "", dateFrom = "", dateTo = "" } = filters || {};
  const filtered = useMemo(() => {
    return sample.filter((r) => {
      const matchesSearch = !search || `${r.nombre} ${r.detalle}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || r.estado === statusFilter;
      const matchesFrom = !dateFrom || new Date(r.fecha) >= new Date(dateFrom);
      const matchesTo = !dateTo || new Date(r.fecha) <= new Date(dateTo);
      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [search, statusFilter, dateFrom, dateTo]);

  const { page, setPage, paged, maxPage } = usePagination(filtered, 5);

  return (
    <div className="data-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Detalle</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 && (
            <tr><td colSpan="6" style={{ textAlign: "center", padding: 24 }}>No hay resultados</td></tr>
          )}
          {paged.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.nombre}</td>
              <td>{r.detalle}</td>
              <td>{r.fecha}</td>
              <td><span className={`status ${r.estado.toLowerCase()}`}>{r.estado}</span></td>
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
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>{"<"}</button>
          {[...Array(Math.min(5, maxPage)).keys()].map(i => (
            <button key={i} className={page === i+1 ? "active" : ""} onClick={() => setPage(i+1)}>{i+1}</button>
          ))}
          {maxPage > 5 && <span className="dots">...{maxPage}</span>}
          <button onClick={() => setPage((p) => Math.min(maxPage, p + 1))} disabled={page === maxPage}>{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default ClientesTable;
