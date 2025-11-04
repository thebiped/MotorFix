import React, { useState } from "react";
import { FaEdit, FaTrash, FaChevronDown } from "react-icons/fa";
import "./ReparacionesAdmin.css";

const ReparacionRow = ({ reparacion }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case "Completado":
        return "status-completed";
      case "En progreso":
        return "status-in-progress";
      case "Pendiente":
        return "status-pending";
      default:
        return "";
    }
  };

  return (
    <div className="reparacion-row-container">
      {/* Cabecera de la Fila */}
      <div
        className="reparacion-row"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="reparacion-info">
          <span className="reparacion-id">#{reparacion.id}</span>
          <div>
            <h4>{reparacion.title}</h4>
            <p>{reparacion.client}</p>
          </div>
        </div>

        <div className="reparacion-status">
          <span className={`status-badge ${getStatusClass(reparacion.status)}`}>
            {reparacion.status}
          </span>
          <FaChevronDown className={`chevron-icon ${expanded ? "expanded" : ""}`} />
        </div>
      </div>

      {/* Detalles Expandibles */}
      <div className={`reparacion-details-slider ${expanded ? "expanded" : ""}`}>
        <div className="reparacion-details-header">
          <h4>Detalles de la Reparación</h4>
          <div className="details-actions">
            <button className="edit-btn"><FaEdit /> Editar</button>
            <button className="delete-btn"><FaTrash /> Eliminar</button>
          </div>
        </div>
        <div className="reparacion-details-content">
          <div className="reparacion-details-info">
            <p><strong>Tipo:</strong> {reparacion.tipo || "N/A"}</p>
            <p><strong>Prioridad:</strong> {reparacion.prioridad || "N/A"}</p>
            <p><strong>Monto:</strong> ${reparacion.total?.toLocaleString() || "0"}</p>
            <p><strong>Desde:</strong> {reparacion.dateFrom || "-"}</p>
            <p><strong>Hasta:</strong> {reparacion.dateTo || "-"}</p>
          </div>
          <div className="progress-container">
            <div className="progress-vertical">
              <div
                className="progress-fill"
                style={{ height: `${reparacion.progreso || 0}%` }}
              ></div>
            </div>
            <span className="progress-label">{reparacion.progreso || 0}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReparacionRow;
