import React from 'react';
import './ConsumoMantenimiento.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint, faGasPump, faStar, faRoad } from '@fortawesome/free-solid-svg-icons';

const ConsumoMantenimiento = () => {
  return (
    <div className="consumo-mantenimiento-container">
      <div className="info-grid">
        <div className="info-item">
          <FontAwesomeIcon icon={faTint} className="info-icon" />
          <span className="info-value">6,5 L/100km</span>
          <span className="info-label">Consumo promedio</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faGasPump} className="info-icon" />
          <span className="info-value">50L</span>
          <span className="info-label">Capacidad del tanque</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faStar} className="info-icon" />
          <span className="info-value">50.000km</span>
          <span className="info-label">Service-recomendado</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faRoad} className="info-icon" />
          <span className="info-value">45.000km</span>
          <span className="info-label">Kilometraje actual</span>
        </div>
      </div>
    </div>
  );
};

export default ConsumoMantenimiento;
