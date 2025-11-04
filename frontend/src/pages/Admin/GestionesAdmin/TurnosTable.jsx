// src/components/GestionesAdmin/TurnosTable.jsx
import React, { useMemo } from "react";
import "./GestionesAdmin.css";

const sample = [
  { id: 1, cliente: "Juan Pérez", vehiculo: "Ford Focus", fecha: "2025-10-20", hora: "10:30", estado: "Confirmado" },
  { id: 2, cliente: "María Gómez", vehiculo: "Toyota Corolla", fecha: "2025-10-22", hora: "09:00", estado: "Pendiente" },
  { id: 3, cliente: "Carlos Díaz", vehiculo: "VW Gol", fecha: "2025-10-25", hora: "14:00", estado: "Activo" },
  { id: 4, cliente: "Lucía Morales", vehiculo: "Peugeot 308", fecha: "2025-10-02", hora: "12:00", estado: "Completado" },
  { id: 5, cliente: "Pedro Ruiz", vehiculo: "Chev Spark", fecha: "2025-10-10", hora: "16:00", estado: "Pendiente" },
  { id: 6, cliente: "Ana Torres", vehiculo: "Renault Clio", fecha: "2025-10-12", hora: "08:30", estado: "Confirmado" },
  { id: 7, cliente: "Rodolfo Pérez", vehiculo: "Honda Civic", fecha: "2025-10-14", hora: "11:00", estado: "Activo" },
];

const TurnosTable = ({ filters }) => {
  const { search = "", statusFilter = "", dateFrom = "", dateTo = "" } = filters || {};
  const filtered = useMemo(() => {
    return sample.filter(r => {
      const matchesSearch = !search || `${r.cliente} ${r.vehiculo}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || r.estado === statusFilter;
      const matchesFrom = !dateFrom || new Date(r.fecha) >= new Date(dateFrom);
      const matchesTo = !dateTo || new Date(r.fecha) <= new Date(dateTo);
      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [search, statusFilter, dateFrom, dateTo]);

  // simple pagination
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
            <th>Cliente</th>
            <th>Vehículo</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 && <tr><td colSpan="6" style={{textAlign:'center', padding:24}}>No hay resultados</td></tr>}
          {paged.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.cliente}</td>
              <td>{r.vehiculo}</td>
              <td>{r.fecha}</td>
              <td>{r.hora}</td>
              <td><span className={`status ${r.estado.toLowerCase()}`}>{r.estado}</span></td>
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

export default TurnosTable;
