import React from "react";
import { Droplet, Fuel, Star, Gauge, Car } from "lucide-react";

const ConsumoMantenimiento = ({ compact = false }) => {
  return (
    <div className={`info-grid ${compact ? "compact" : ""}`}>
      <div className="info-lead">
        <div className="icon">
          <Car size={18} />
        </div>
      </div>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon"></div>
          <Droplet size={16} />
          <span className="info-value">6,5 L/100km</span>
        </div>
        <span className="info-label">Consumo promedio</span>
      </div>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon">
            <Fuel size={16} />
          </div>
          <span className="info-value">50 L</span>
        </div>

        <span className="info-label">Capacidad tanque</span>
      </div>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon">
            <Star size={16} />
          </div>
          <span className="info-value">50.000 km</span>
        </div>

        <span className="info-label">Service recomendado</span>
      </div>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon">
            <Gauge size={16} />
          </div>
          <span className="info-value">45.000 km</span>
        </div>
        <span className="info-label">Kilometraje actual</span>
      </div>
    </div>
  );
};

export default ConsumoMantenimiento;
