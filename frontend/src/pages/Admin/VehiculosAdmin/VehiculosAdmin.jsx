import { useState } from "react";
import {
  User,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Gauge,
  Zap,
  Cog,
  Palette,
  Car,
  ScanLine,
  Droplet,
  Fuel,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./VehiculosAdmin.css";
// Asegúrate de que las rutas a tus imágenes sean correctas
import vehiculo from "../../../assets/img/toyota-corolla.png";
import logoToyota from "../../../assets/img/logo-toyota.png";

// --- COMPONENTE INFORMACIÓN BÁSICA ---
const InformacionBasica = () => {
  return (
    <div className="info-grid">
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
            <ScanLine size={20} />
          </div>
          <span className="info-value">ABC123</span>
        </div>
        <span className="info-label">Patente</span>
      </div>
    </div>
  );
};

// --- COMPONENTE CONSUMO Y MANTENIMIENTO ---
const ConsumoMantenimiento = () => {
  return (
    <div className="info-grid">
      <div className="info-item small-icon">
        <Droplet size={20} />
        <span className="info-value">6,5 L/100km</span>
        <span className="info-label">Consumo promedio</span>
      </div>
      <div className="info-item small-icon">
        <Fuel size={20} />
        <span className="info-value">50L</span>
        <span className="info-label">Capacidad del tanque</span>
      </div>
      <div className="info-item small-icon">
        <Star size={20} />
        <span className="info-value">50.000km</span>
        <span className="info-label">Service recomendado</span>
      </div>
      <div className="info-item small-icon">
        <Gauge size={20} />
        <span className="info-value">45.000km</span>
        <span className="info-label">Kilometraje actual</span>
      </div>
    </div>
  );
};

// --- COMPONENTE HISTORIAL VEHÍCULO ---
const HistorialVehiculo = ({ onBack }) => {
  const historial = [
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'Finalizado', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'Finalizado', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'Finalizado', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'En progreso', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'Finalizado', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
  ];

  return (
    <div className="historial-vehiculo-container">
      <div className="historial-content">
        <button onClick={onBack} className="back-button">
          <ChevronLeft size={20} /> Volver
        </button>
        <h3 className="historial-title">Historial del Vehículo</h3>
        <p className="historial-subtitle">
          Historial del Vehículo de reparaciones y mantenimientos realizados al
          vehículo
        </p>
        <div className="table-wrapper">
          <table className="historial-table">
            <thead>
              <tr>
                <th>N° Reparaciones</th>
                <th>Fecha Ingreso</th>
                <th>Fecha Salida</th>
                <th>Tipo de Reparación</th>
                <th>Mecánico Asignado</th>
                <th>Estado</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.fechaIngreso}</td>
                  <td>{item.fechaSalida}</td>
                  <td>{item.tipo}</td>
                  <td>{item.mecanico}</td>
                  <td>
                    <span
                      className={`status-historial ${item.estado
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {item.estado}
                    </span>
                  </td>
                  <td>{item.observaciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
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
    <div
      className={`vehiculos-admin-container ${
        showHistory ? "history-visible" : ""
      }`}
    >
      {/* ESTA ES LA FORMA DE FONDO GRIS/BLANCA */}
      <div className="background-shape"></div>

      <header className="vehiculo-header">
        <div className="brand-line">
          <img
            src={logoToyota}
            alt="Logo Toyota"
            className="brand-logo-vehiculo"
          />
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

      {/* Contenedor principal.
        Este contenedor ahora usará flex-grow: 1 para 
        ocupar todo el espacio restante.
      */}
      <div className="slider-content">
        <nav className="view-selector">
          <button
            className={`nav-button-admin ${
              activeView === "informacion" ? "active" : ""
            }`}
            onClick={() => setActiveView("informacion")}
          >
            <div className="icon">
              <CheckCircle size={18} />
            </div>
            <span>Información básica</span>
          </button>

          <button
            className={`nav-button-admin ${
              activeView === "consumo" ? "active" : ""
            }`}
            onClick={() => setActiveView("consumo")}
          >
            <div className="icon">
              <Clock size={18} />
            </div>
            <span>Consumo y mantenimiento</span>
          </button>

          <button className="nav-button-admin" onClick={handleShowHistory}>
            <div className="icon">
              <AlertTriangle size={18} />
            </div>
            <span>Historial del vehículo</span>
          </button>
        </nav>

        {/* Coche posicionado absolutamente */}
        <div className="hero-car-image">
          <img src={vehiculo} alt="Toyota Corolla" />
        </div>

        {/* Tarjeta 1 (Principal) */}
        <div className="vehicle-card">
          <div className="vehicle-card-header">
            <img
              src={logoToyota}
              alt="Logo Toyota"
              className="card-brand-logo"
            />
            <span>Toyota</span>
            <button title="Editar" className="card-edit-button">
              <Edit size={16} />
            </button>
          </div>
          <img
            src={vehiculo}
            alt="Toyota Corolla"
            className="vehicle-card-image-main"
          />
        </div>
        
        {/* === TARJETA 2 (AÑADIDA) === */}
        <div className="vehicle-card-2">
          <div className="vehicle-card-header">
            <img
              src={logoToyota}
              alt="Logo Toyota"
              className="card-brand-logo"
            />
            <span>Toyota</span>
            <button title="Editar" className="card-edit-button">
              <Edit size={16} />
            </button>
          </div>
          <img
            src={vehiculo}
            alt="Toyota Corolla"
            className="vehicle-card-image-main"
          />
        </div>

      </div>

      {/* Este footer ahora estará posicionado 
        absolutamente en la parte inferior.
      */}
      <footer className="slider-info">
        <div className="info-details">{renderContent()}</div>

        {/* Carrusel de conductores */}
        <div className="other-drivers-carousel">
          <button className="carousel-arrow">
            <ChevronLeft size={16} />
          </button>
          <div className="driver-avatar active">
            <div className="avatar-icon">
              <User size={20} />
            </div>
            <span>Juan Carlos</span>
          </div>
          <div className="driver-avatar">
            <div className="avatar-icon">
              <User size={20} />
            </div>
            <span>Viste</span>
          </div>
          <div className="driver-avatar">
            <div className="avatar-icon">
              <User size={20} />
            </div>
            <span>Roberto</span>
          </div>
          <button className="carousel-arrow">
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>

      {/* El modal de historial se renderiza condicionalmente */}
      {showHistory && <HistorialVehiculo onBack={handleBackFromHistory} />}
    </div>
  );
};

export default VehiculosAdmin;