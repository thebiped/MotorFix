import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import "./VehicleRepairs.css";

const PLACEHOLDER_CAR =
  "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect fill='%23000' width='100%25' height='100%25'/><text x='50%25' y='50%25' font-size='18' fill='%23fff' alignment-baseline='middle' text-anchor='middle'>NO IMAGE</text></svg>";

const VehicleRepairs = () => {
  // Obtenemos el ID del mecánico desde el Layout
  const { mecanicoId } = useOutletContext();

  const [repairs, setRepairs] = useState([]);
  const [selected, setSelected] = useState(null);

  // ----------------------- Fetch Reparaciones -----------------------
  const fetchRepairs = async () => {
    if (!mecanicoId) return;

    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/turnos/mecanico/${mecanicoId}`
      );
      console.log("Turnos del backend:", data);
      setRepairs(data);
    } catch (err) {
      console.error("Error fetching reparaciones:", err);
      if (err.response) console.error("Detalle del error:", err.response.data);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, [mecanicoId]);

  // ----------------------- Seleccionar Turno -----------------------
  const selectRepair = (repair) => setSelected(repair);
  const closeDetail = () => setSelected(null);

  // ----------------------- Renderizado -----------------------
  return (
    <div className="vehicle-repairs-container">
      <div className="repairs-list">
        {repairs.length === 0 && (
          <p style={{ color: "#aaa", padding: "20px" }}>
            No hay turnos asignados
          </p>
        )}

        {repairs.map((r) => (
          <div
            key={r.id}
            className={`repair-block ${
              r.prioridad === "alta" ? "high-priority" : ""
            }`}
            onClick={() => selectRepair(r)}
          >
            <h2 className="problem-title">
              {r.turno.descripcion?.toUpperCase() || "SIN DESCRIPCIÓN"}
            </h2>
            <span className="problem-subtitle">DE FORMA BREVE</span>
            <span className="priority-tag">{r.prioridad?.toUpperCase()}</span>
            <div className="user-name">{r.user?.name || "-"}</div>
            <div className="car-name">
              {r.car?.brand} {r.car?.model}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="repair-detail-panel">
          <button className="close-btn" onClick={closeDetail}>
            X
          </button>

          <div className="car-image-wrapper">
            <img src={selected.car?.image || PLACEHOLDER_CAR} alt="" />
          </div>

          <div className="car-stats">
            <div>Vel: {selected.car?.top_speed || "N/A"} km/h</div>
            <div>Acel: {selected.car?.acceleration || "N/A"} s</div>
            <div>Man: {selected.car?.handling || "N/A"}</div>
          </div>

          <div className="hud-panel">
            <h3>DETALLES DEL TURNO</h3>
            <p>
              <strong>Problema:</strong> {selected.turno?.descripcion || "-"}
            </p>
            <p>
              <strong>Tipo de reparación:</strong>{" "}
              {selected.turno?.tipo_reparacion || "-"}
            </p>
            <p>
              <strong>Fecha / Hora:</strong> {selected.turno?.fecha || "-"}
            </p>
            <p>
              <strong>Estado:</strong> {selected.estado || "-"}
            </p>
            <p>
              <strong>Creación:</strong>{" "}
              {new Date(selected.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleRepairs;
