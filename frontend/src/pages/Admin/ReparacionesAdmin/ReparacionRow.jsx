import React, { useState } from "react";
import { FaEdit, FaTrash, FaChevronDown, FaChevronRight } from "react-icons/fa"; // Importamos FaChevronRight si lo deseas
import "./ReparacionesAdmin.css";

const ReparacionRow = ({ reparacion }) => {
  const [expanded, setExpanded] = useState(false);

  // Función de utilidad para obtener la clase CSS del estado
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
      {/* Cabecera de la Fila (Haciéndola clickeable para el despliegue) */}
      <div
        className="reparacion-row-main"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Columna 1: ID y Título/Cliente */}
        <div className="reparacion-info-group">
          <span className="reparacion-id">#{reparacion.id}</span>
          <div className="reparacion-title-client">
            <h4>{reparacion.title}</h4>
            <p>{reparacion.client}</p>
          </div>
        </div>

        {/* Columna 2: Estado y Acciones/Icono */}
        <div className="reparacion-status-actions">
          <span className={`status-badge ${getStatusClass(reparacion.status)}`}>
            {reparacion.status}
          </span>
          <FaChevronDown className={`chevron-icon ${expanded ? "expanded" : ""}`} />
        </div>
      </div>

      {/* Detalles Expandibles (Transición y Contenido) */}
      <div className={`reparacion-details-slider ${expanded ? "expanded" : ""}`}>
        <div className="reparacion-details-content">
          
          <div className="reparacion-details-info">
            <h4 className="details-heading">Detalles de la Reparación</h4>
            <div className="details-info-grid">
              <p><strong>Tipo:</strong> {reparacion.tipo || "N/A"}</p>
              <p><strong>Prioridad:</strong> {reparacion.prioridad || "N/A"}</p>
              <p><strong>Monto:</strong> ${reparacion.total?.toLocaleString() || "0"}</p>
              <p><strong>Desde:</strong> {reparacion.dateFrom || "-"}</p>
              <p><strong>Hasta:</strong> {reparacion.dateTo || "-"}</p>
            </div>
          </div>
          
          <div className="reparacion-details-actions">
            <button className="edit-btn hud-button-small">
              <FaEdit /> Editar
            </button>
            <button className="delete-btn hud-button-small">
              <FaTrash /> Eliminar
            </button>
          </div>
          
          {/* Se elimina la barra vertical ya que no se ve en la imagen,
              pero se deja el espacio para que los detalles se vean como en columna. */}
        </div>
      </div>
    </div>
  );
};

export default ReparacionRow;