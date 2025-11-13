import { useState } from "react";
import { User, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import "./VehiculoCliente.css";
import InformacionBasica from "./InformacionBasica";
import ConsumoMantenimiento from "./ConsumoMantenimiento";
import HistorialVehiculo from "./HistorialVehiculo";
import vehiculo from '../../../assets/img/toyota-corolla.png';
import logoToyota from '../../../assets/img/logo-toyota.png';

const VehiculoCliente = () => {
  const [activeView, setActiveView] = useState("informacion");
  const [showHistory, setShowHistory] = useState(false);

  const handleShowHistory = () => setShowHistory(true);
  const handleBackFromHistory = () => setShowHistory(false);

  const renderContent = () => {
    if (showHistory) return null;
    switch (activeView) {
      case "informacion":
        return <InformacionBasica />;
      case "consumo":
        return <ConsumoMantenimiento />;
      default:
        return <InformacionBasica />;
    }
  };

  return (
    <div className={`vehiculos-cliente-container ${showHistory ? "history-visible" : ""}`}>
      <header className="vehiculo-header">
        <div className="brand-line">
          <img src={logoToyota} alt="Logo Toyota" className="brand-logo-vehiculo" />
          <h3 className="brand-title">Toyota</h3>
        </div>
        <div className="owner-details">
          <User size={28} className="owner-icon" />
          <div>
            <h1 className="owner-name">JUAN CARLOS PÉREZ</h1>
            <h2 className="car-model">Toyota Corolla 2021</h2>
          </div>
        </div>
      </header>

      <div className="slider-content">
        <nav className="view-selector">
          <button
            className={`nav-button ${activeView === "informacion" ? "active" : ""}`}
            onClick={() => setActiveView("informacion")}
          >
            <CheckCircle size={18} />
            <span>Información básica</span>
          </button>
          <button
            className={`nav-button ${activeView === "consumo" ? "active" : ""}`}
            onClick={() => setActiveView("consumo")}
          >
            <Clock size={18} />
            <span>Consumo y mantenimiento</span>
          </button>
          <button className="nav-button" onClick={handleShowHistory}>
            <AlertTriangle size={18} />
            <span>Historial del vehículo</span>
          </button>
        </nav>
        <div className="hero-car-image">
          <img src={vehiculo} alt="Toyota Corolla" />
        </div>
        <div className="vehicle-card">
          <div className="vehicle-card-header">
            <span>Toyota</span>
          </div>
          <img src={vehiculo} alt="Toyota Corolla" className="vehicle-card-image-main" />
        </div>
        <div className="vehicle-card-2">
          <div className="vehicle-card-header">
            <span>Toyota</span>
          </div>
          <img src={vehiculo} alt="Toyota Corolla" className="vehicle-card-image-main" />
        </div>
      </div>

      <footer className="slider-info">
        <div className="info-details">
          {renderContent()}
        </div>
      </footer>

      {showHistory && <HistorialVehiculo onBack={handleBackFromHistory} />}
    </div>
  );
};

export default VehiculoCliente;
