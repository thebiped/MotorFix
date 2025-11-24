    import React, { useEffect, useState } from "react";
import { getHistorial } from "../../services/vehicleService";

const HistorialVehiculo = ({ vehiculoId, onBack }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getHistorial(vehiculoId)
      .then(setHistorial)
      .catch((err) => setError(err.message || "Error al cargar historial"))
      .finally(() => setLoading(false));
  }, [vehiculoId]);

  return (
    <div className="historial-vehiculo-container" style={{ visibility: historial.length || error || loading ? "visible" : "hidden", opacity: historial.length || error || loading ? 1 : 0 }}>
      <div className="historial-content">
        <button onClick={onBack} className="back-button">&lt; Volver</button>
        <h3>Historial del Vehículo</h3>
        <p>Historial de reparaciones y mantenimientos realizados al vehículo</p>

        {loading && <p>Cargando historial...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <table className="historial-table">
            <thead>
              <tr>
                <th>N° Reparaciones</th>
                <th>Fecha Ingreso</th>
                <th>Fecha Salida</th>
                <th>Tipo de Reparación</th>
                <th>Mecánico Asignado</th>
                <th>Estado</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.fechaIngreso}</td>
                  <td>{item.fechaSalida}</td>
                  <td>{item.tipo}</td>
                  <td>{item.mecanico}</td>
                  <td>
                    <span className={`status-historial ${item.estado.toLowerCase().replace(" ", "-")}`}>
                      {item.estado}
                    </span>
                  </td>
                  <td>{item.observaciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistorialVehiculo;
