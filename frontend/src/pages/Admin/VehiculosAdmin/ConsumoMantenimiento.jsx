import React from "react";
import { Droplet, Fuel, Star, Gauge, Car } from "lucide-react";

const ConsumoMantenimiento = ({ compact = false }) => {
  return (
    <div className={`info-grid ${compact ? "compact" : ""}`}>
      <div className="info-lead">
        <Car size={18} />
      </div>
      <div className="info-item">
        <Droplet size={16} />
        <span className="info-value">6,5 L/100km</span>
        <span className="info-label">Consumo promedio</span>
      </div>
      <div className="info-item">
        <Fuel size={16} />
        <span className="info-value">50 L</span>
        <span className="info-label">Capacidad tanque</span>
      </div>
      <div className="info-item">
        <Star size={16} />
        <span className="info-value">50.000 km</span>
        <span className="info-label">Service recomendado</span>
      </div>
      <div className="info-item">
        <Gauge size={16} />
        <span className="info-value">45.000 km</span>
        <span className="info-label">Kilometraje actual</span>
      </div>
    </div>
  );
};

export default ConsumoMantenimiento;
