import React from 'react';
import './InformacionBasica.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBolt, faHorseHead, faCogs, faPalette, faIdCard } from '@fortawesome/free-solid-svg-icons';

const InformacionBasica = () => {
  return (
    <div className="informacion-basica-container">
      <div className="info-grid">
        <div className="info-item">
          <FontAwesomeIcon icon={faTachometerAlt} className="info-icon" />
          <span className="info-value">190km/h</span>
          <span className="info-label">Velocidad máxima</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faBolt} className="info-icon" />
          <span className="info-value">6,8s</span>
          <span className="info-label">0 a 100km/h</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faHorseHead} className="info-icon" />
          <span className="info-value">139hp</span>
          <span className="info-label">Potencia máxima</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faCogs} className="info-icon" />
          <span className="info-value">CVT</span>
          <span className="info-label">Transmisión</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faPalette} className="info-icon" />
          <span className="info-value">Blanco</span>
          <span className="info-label">Color base</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faIdCard} className="info-icon" />
          <span className="info-value">ABC123</span>
          <span className="info-label">Patente</span>
        </div>
      </div>
    </div>
  );
};

export default InformacionBasica;
