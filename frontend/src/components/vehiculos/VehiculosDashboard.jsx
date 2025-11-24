import { useState, useRef, useEffect } from "react";
import {
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Trash2
} from "lucide-react";
import "./VehiculosDashboard.css";

// Imagenes
import vehiculoImg from "../../assets/img/toyota-corolla.png";
import logoToyota from "../../assets/img/logo-toyota.png";

// --- COMPONENTES ---
import InformacionBasica from "./InformacionBasica";
import ConsumoMantenimiento from "./ConsumoMantenimiento";
import HistorialVehiculo from "./HistorialVehiculo";

// --- DATOS SIMULADOS / REEMPLAZAR CON API ---
const mockVehicles = [
  { id: 1, brand: "Toyota", name: "Toyota Corolla 2021", image: vehiculoImg },
  { id: 2, brand: "Toyota", name: "Toyota Corolla (Black)", image: vehiculoImg },
  { id: 3, brand: "Toyota", name: "Toyota Yaris Sport", image: vehiculoImg },
  { id: 4, brand: "Toyota", name: "Toyota Hilux", image: vehiculoImg },
];

const mockUsers = [
  { id: 1, name: "Juan Carlos" },
  { id: 2, name: "Maria L." },
  { id: 3, name: "Roberto" },
  { id: 4, name: "Ana P." },
  { id: 5, name: "Pedro G." },
  { id: 6, name: "Lucía M." },
  { id: 7, name: "Carlos R." },
];

const VehiculosDashboard = ({ isAdmin }) => {
  const [activeView, setActiveView] = useState("informacion");
  const [showHistory, setShowHistory] = useState(false);

  // Vehículos
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next");
  const currentVehicle = mockVehicles[currentVehicleIndex] || mockVehicles[0];

  // Usuarios (solo admin)
  const infiniteUsers = [...mockUsers, ...mockUsers, ...mockUsers];
  const START_INDEX = mockUsers.length;
  const [selectedIndex, setSelectedIndex] = useState(START_INDEX);
  const [viewStartIndex, setViewStartIndex] = useState(START_INDEX);
  const usersSliderRef = useRef(null);

  // Manejo vehículos
  const handleVehicleNext = () => {
    setSlideDirection("next");
    setCurrentVehicleIndex((prev) => (prev + 1) % mockVehicles.length);
  };
  const handleVehiclePrev = () => {
    setSlideDirection("prev");
    setCurrentVehicleIndex((prev) => (prev - 1 + mockVehicles.length) % mockVehicles.length);
  };

  // Manejo usuarios (solo admin)
  useEffect(() => {
    if (!isAdmin || !usersSliderRef.current) return;
    const cardWidth = usersSliderRef.current.clientWidth / 3;
    usersSliderRef.current.scrollTo({ left: viewStartIndex * cardWidth, behavior: "smooth" });
  }, [viewStartIndex, isAdmin]);

  const handleUserNav = (direction) => {
    if (!isAdmin) return;
    const nextIndex = direction === "right" ? selectedIndex + 1 : selectedIndex - 1;
    setSelectedIndex(nextIndex);
    if (direction === "right" && nextIndex > viewStartIndex + 2) setViewStartIndex(prev => prev + 1);
    if (direction === "left" && nextIndex < viewStartIndex) setViewStartIndex(prev => prev - 1);
  };

  // Renderizar contenido principal
  const renderContent = () => {
    if (showHistory) return null;
    return activeView === "informacion" ? <InformacionBasica /> : <ConsumoMantenimiento />;
  };

  return (
    <div className={`vehiculos-admin-container ${showHistory ? "history-visible" : ""}`}>
      <div className="background-shape"></div>

      {/* HEADER */}
      <header className="vehiculo-header">
        <div className="brand-line">
          <img src={logoToyota} alt="Toyota" className="brand-logo-vehiculo" />
          <h3 className="brand-title">{currentVehicle.brand}</h3>
        </div>
        <div className="owner-details">
          <User size={28} className="owner-icon" />
          <div>
            <h1 className="owner-name">Juan Carlos Pérez</h1>
            <h2 className="car-model">{currentVehicle.name}</h2>
          </div>
        </div>
      </header>

      {/* SLIDER Y SECCIONES */}
      <div className="slider-content">
        {/* NAVBAR VIEWS */}
        <nav className="view-selector">
          <button className={`nav-button-admin ${activeView === "informacion" ? "active" : ""}`} onClick={() => setActiveView("informacion")}>
            <CheckCircle size={18} /><span>Información básica</span>
          </button>
          <button className={`nav-button-admin ${activeView === "consumo" ? "active" : ""}`} onClick={() => setActiveView("consumo")}>
            <Clock size={18} /><span>Consumo y mantenimiento</span>
          </button>
          <button className="nav-button-admin" onClick={() => setShowHistory(true)}>
            <AlertTriangle size={18} /><span>Historial del vehículo</span>
          </button>
        </nav>

        {/* VEHÍCULO CENTRAL */}
        <div className="hero-car-section">
          <img key={currentVehicle.id} src={currentVehicle.image} alt={currentVehicle.name} className={`hero-car-image anim-${slideDirection}`} />
          {mockVehicles.length > 1 && (
            <>
              <button className="red-arrow-btn arrow-left" onClick={handleVehiclePrev}><ChevronLeft size={24} /></button>
              <button className="red-arrow-btn arrow-right" onClick={handleVehicleNext}><ChevronRight size={24} /></button>
            </>
          )}
        </div>

        {/* SLIDER VEHÍCULOS MINI */}
        {mockVehicles.length > 1 && (
          <div className="cards-slider-section">
            <div className="cards-track" style={{ transform: `translateX(-${currentVehicleIndex * 220}px)` }}>
              {mockVehicles.map((car, index) => (
                <div key={car.id} className={`vehicle-card-mini ${index === currentVehicleIndex ? "active" : ""}`}>
                  <div className="card-header-mini">
                    <div className="mini-brand"><img src={logoToyota} width={16} alt="logo"/> {car.brand}</div>
                    <Trash2 size={16} color="#ff0000" style={{ cursor: "pointer" }} />
                  </div>
                  <img src={car.image} className="mini-img" alt="mini car" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER SLIDER USUARIOS (solo admin) */}
      {isAdmin && (
        <footer className="slider-info">
          <div className="info-details">{renderContent()}</div>
          <div className="other-drivers-carousel">
            <button className="carousel-arrow" onClick={() => handleUserNav("left")}><ChevronLeft size={16} /></button>
            <div className="slider-mask">
              <div ref={usersSliderRef} style={{ display: "flex", overflowX: "hidden", gap: 0, padding: "10px 0" }}>
                {infiniteUsers.map((u, i) => {
                  const isActive = i === selectedIndex;
                  return (
                    <div key={`${u.id}-${i}`} style={{ flex: "0 0 33%", padding: "0 10px", boxSizing: "border-box" }}>
                      <div className={`driver-avatar ${isActive ? "active" : ""}`}
                           style={{
                             transform: isActive ? "scale(1.05)" : "scale(0.95)",
                             opacity: isActive ? 1 : 0.65,
                             zIndex: isActive ? 10 : 1,
                             cursor: "pointer"
                           }}
                           onClick={() => setSelectedIndex(i)}>
                        <div className="avatar-icon" style={{ backgroundColor: isActive ? "#ff0000" : "rgba(255,0,0,0.15)" }}>
                          <User size={20} color="white" />
                        </div>
                        <span style={{ color: isActive ? "#fff" : "#999", fontSize: "0.75rem" }}>{u.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button className="carousel-arrow" onClick={() => handleUserNav("right")}><ChevronRight size={16} /></button>
          </div>
        </footer>
      )}

      {/* MODAL HISTORIAL */}
      {showHistory && <HistorialVehiculo onBack={() => setShowHistory(false)} />}
    </div>
  );
};

export default VehiculosDashboard;
