import React, { useEffect, useState } from "react";
import "./HistorialMecanico.css";

const dummyData = [
  { patente: "DEF 456", vehiculo: "Volkswagen Gol 2019", cliente: "Ana García", trabajo: "Cambio de aceite y filtros", ingreso: "12/03/2024", estimada: "14/03/2024", costo: "$4050", calificacion: "5★" },
  { patente: "ABC 123", vehiculo: "Ford Focus 2020", cliente: "Juan Pérez", trabajo: "Frenos", ingreso: "10/03/2024", estimada: "12/03/2024", costo: "$5200", calificacion: "4★" },
  { patente: "GHI 789", vehiculo: "Renault Clio 2021", cliente: "Lucía Fernández", trabajo: "Suspensión", ingreso: "15/03/2024", estimada: "17/03/2024", costo: "$6200", calificacion: "5★" }
];

const HistorialMecanico = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setRows(dummyData);
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <div className="hud-container">
      <header className="hud-header">
        <h1>HISTORIAL DE REPARACIONES</h1>
        <p>Revisa todas tus reparaciones completadas</p>
      </header>

      <div className="status-cards">
        <div className="status-card holo-fade" style={{ animationDelay: "0.1s" }}>
          <h3>Total Reparaciones</h3>
          <span className="number">26</span>
        </div>
        <div className="status-card holo-fade" style={{ animationDelay: "0.2s" }}>
          <h3>Ganancias</h3>
          <span className="number">$3.000.250</span>
        </div>
        <div className="status-card holo-fade" style={{ animationDelay: "0.3s" }}>
          <h3>Calificación Promedio</h3>
          <span className="number">4.9/5</span>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-overlay">
            <div className="hud-loader"></div>
          </div>
        ) : (
          <div className="table-scanner-wrapper">
            <table className="hud-table">
              <thead>
                <tr>
                  <th>Patente</th>
                  <th>Vehículo</th>
                  <th>Cliente</th>
                  <th>Trabajo</th>
                  <th>Ingreso</th>
                  <th>Estimada</th>
                  <th>Costo</th>
                  <th>Calificación</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    style={{ animationDelay: `${i * 0.15 + 0.2}s` }}
                    className="fade-row holo-fade"
                  >
                    <td>{row.patente}</td>
                    <td>{row.vehiculo}</td>
                    <td>{row.cliente}</td>
                    <td>{row.trabajo}</td>
                    <td>{row.ingreso}</td>
                    <td>{row.estimada}</td>
                    <td>{row.costo}</td>
                    <td>{row.calificacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="hud-scanner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialMecanico;
