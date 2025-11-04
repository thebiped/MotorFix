import { useState, useRef, useEffect } from "react";
import { User, Edit, Trash2, CheckCircle, Clock, AlertTriangle, ChevronRight, ChevronLeft } from "lucide-react";
import "./VehiculosAdmin.css";
import InformacionBasica from "./InformacionBasica";
import ConsumoMantenimiento from "./ConsumoMantenimiento";
import HistorialVehiculo from "./HistorialVehiculo";
import vehiculo from '../../../assets/img/toyota-corolla.png'

const VehiculosAdmin = () => {
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
    <div className={`vehiculos-admin-container ${showHistory ? "history-visible" : ""}`}>
      {/* <div className="background-shape"></div> */}
      
      <header className="vehiculo-header">
        <div className="brand-line">
          <div className="brand-logo-vehiculo"></div>
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
          <img src={vehiculo} alt="" />
        </div>
        <div className="vehicle-card">
          <div className="vehicle-card-header">
            <span>Toyota</span>
            <div className="card-actions">
              <Edit size={16} />
              <Trash2 size={16} />
            </div>
          </div>
          <div className="vehicle-card-image"></div>
        </div>
        <div className="vehicle-card-2">
          <div className="vehicle-card-header">
            <span>Toyota</span>
            <div className="card-actions">
              <Edit size={16} />
              <Trash2 size={16} />
            </div>
          </div>
          <div className="vehicle-card-image"></div>
        </div>
      </div>

      <footer className="slider-info">
        <div className="info-details">
          {renderContent()}
        </div>
        <div className="user-slider-nav">
          <button className="user-nav-arrow"><ChevronLeft size={16} /></button>
          <div className="user-icon active">
            <User size={20} />
            <span>Juan</span>
          </div>
          <div className="user-icon">
            <User size={20} />
            <span>María</span>
          </div>
          <div className="user-icon">
            <User size={20} />
            <span>Roberto</span>
          </div>
          <button className="user-nav-arrow"><ChevronRight size={16} /></button>
        </div>
      </footer>

      {showHistory && <HistorialVehiculo onBack={handleBackFromHistory} />}
    </div>
  );
};

export default VehiculosAdmin;
