import React from "react";
import { Gauge, Zap, Cog, Palette, Car, ScanLine } from "lucide-react";

const InformacionBasica = ({ compact = false }) => {
  return (
    <div className={`info-grid ${compact ? "compact" : ""}`}>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon">
            <Gauge size={20} />
          </div>
          <span className="info-value">190km/h</span>
        </div>
        <span className="info-label">Velocidad máxima</span>
      </div>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon">
            <Zap size={20} />
          </div>
          <span className="info-value">6,8s</span>
        </div>
        <span className="info-label">0 a 100km/h</span>
      </div>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon">
            <Cog size={20} />
          </div>
          <span className="info-value">139hp</span>
        </div>

        <span className="info-label">Potencia máxima</span>
      </div>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon">
            <Car size={20} />
          </div>
          <span className="info-value">CVT</span>
        </div>
        <span className="info-label">Transmisión</span>
      </div>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon">
            <Palette size={20} />
          </div>
          <span className="info-value">Blanco</span>
        </div>
        <span className="info-label">Color base</span>
      </div>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon">
            <ScanLine />
          </div>
          <span className="info-value">ABC123</span>
        </div>
        <span className="info-label">Patente</span>
      </div>
    </div>
  );
};

export default InformacionBasica;
