import React from "react";
import "./HistorialCliente.css";

const sampleRows = new Array(5).fill(0).map((_, i) => ({
  patente: "DEF 456",
  vehiculo: "Volkswagen Gol 2019",
  cliente: "Ana García",
  trabajo: "Cambio de aceite y filtros",
  ingreso: "12/03/2024",
  estimada: "14/03/2024",
  costo: "$4050",
  calif: "5★",
}));

const HistorialCliente = () => {
  return (
    <div className="historial-cliente-container">
      <div className="historial-top">
        <div>
          <h1>HISTORIAL DE SERVICIOS</h1>
          <p className="subtitle">
            Registro completo de mantenimientos y reparaciones
          </p>
        </div>
        <div className="top-actions">
          <button className="btn-outline">Generar Reporte</button>
          <button className="btn-primary">Descargar PDF</button>
        </div>
      </div>

      <div className="status-cards">
        <div className="status-card">
          <h4>Total Servicios</h4>
          <div className="num">5</div>
        </div>
        <div className="status-card">
          <h4>Gasto Total</h4>
          <div className="num">$68.0K</div>
        </div>
        <div className="status-card">
          <h4>Promedio por Servicio</h4>
          <div className="num">$17.000</div>
        </div>
        <div className="status-card">
          <h4>Último Servicio</h4>
          <div className="num">14 mar</div>
        </div>
      </div>

      <div className="filters">
        <input className="filter-search" placeholder="Buscar por servicio..." />
        <select className="filter-select">
          <option>Vehículo</option>
        </select>
        <select className="filter-select">
          <option>Año</option>
        </select>
        <button className="btn-apply">Aplicar Filtros</button>
      </div>

      <div className="datos-vehiculos">
        <div className="datos-header">
          <h2>DATOS VEHÍCULOS</h2>
          <div className="datos-actions">
            <button className="link">Borrar</button>
            <button className="link">Editar</button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="hist-table">
            <thead>
              <tr>
                <th></th>
                <th>Patente</th>
                <th>Vehículo</th>
                <th>Cliente</th>
                <th>Trabajo Realizado</th>
                <th>Fecha Ingreso</th>
                <th>Fecha Estimada</th>
                <th>Costo</th>
                <th>Calificación</th>
              </tr>
            </thead>
            <tbody>
              {sampleRows.map((r, idx) => (
                <tr key={idx}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{r.patente}</td>
                  <td>{r.vehiculo}</td>
                  <td>{r.cliente}</td>
                  <td>{r.trabajo}</td>
                  <td>{r.ingreso}</td>
                  <td>{r.estimada}</td>
                  <td>{r.costo}</td>
                  <td>{r.calif}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="pg">‹</button>
          <button className="pg active">1</button>
          <button className="pg">2</button>
          <button className="pg">3</button>
          <span className="dots">...</span>
          <button className="pg">24</button>
          <button className="pg">›</button>
        </div>
      </div>
    </div>
  );
};

export default HistorialCliente;
