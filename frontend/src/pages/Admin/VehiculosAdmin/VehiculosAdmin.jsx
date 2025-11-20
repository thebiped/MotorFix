import { useState, useRef, useEffect } from "react";
import {
  User,
  Edit,
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

import vehiculo from "../../../assets/img/toyota-corolla.png";
import logoToyota from "../../../assets/img/logo-toyota.png";

// --- DATOS ---
const mockUsers = [
  { id: 1, name: "Juan Carlos" },
  { id: 2, name: "Maria L." },
  { id: 3, name: "Roberto" },
  { id: 4, name: "Ana P." },
  { id: 5, name: "Pedro G." },
  { id: 6, name: "Lucía M." },
  { id: 7, name: "Carlos R." },
];

// --- COMPONENTES DE INFORMACIÓN (Sin cambios) ---
const InformacionBasica = () => (
  <div className="info-grid">
    <div className="info-item"><div className="info-item-primary"><div className="icon"><Gauge size={20} /></div><span className="info-value">190km/h</span></div><span className="info-label">Velocidad máxima</span></div>
    <div className="info-item"><div className="info-item-primary"><div className="icon"><Zap size={20} /></div><span className="info-value">6,8s</span></div><span className="info-label">0 a 100km/h</span></div>
    <div className="info-item"><div className="info-item-primary"><div className="icon"><Cog size={20} /></div><span className="info-value">139hp</span></div><span className="info-label">Potencia máxima</span></div>
    <div className="info-item"><div className="info-item-primary"><div className="icon"><Car size={20} /></div><span className="info-value">CVT</span></div><span className="info-label">Transmisión</span></div>
    <div className="info-item"><div className="info-item-primary"><div className="icon"><Palette size={20} /></div><span className="info-value">Blanco</span></div><span className="info-label">Color base</span></div>
    <div className="info-item"><div className="info-item-primary"><div className="icon"><ScanLine size={20} /></div><span className="info-value">ABC123</span></div><span className="info-label">Patente</span></div>
  </div>
);

const ConsumoMantenimiento = () => (
  <div className="info-grid">
    <div className="info-item small-icon"><Droplet size={20} /><span className="info-value">6,5 L/100km</span><span className="info-label">Consumo promedio</span></div>
    <div className="info-item small-icon"><Fuel size={20} /><span className="info-value">50L</span><span className="info-label">Capacidad del tanque</span></div>
    <div className="info-item small-icon"><Star size={20} /><span className="info-value">50.000km</span><span className="info-label">Service recomendado</span></div>
    <div className="info-item small-icon"><Gauge size={20} /><span className="info-value">45.000km</span><span className="info-label">Kilometraje actual</span></div>
  </div>
);

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
        <button onClick={onBack} className="back-button"><ChevronLeft size={20} /> Volver</button>
        <h3 className="historial-title">Historial del Vehículo</h3>
        <p className="historial-subtitle">Historial del Vehículo de reparaciones y mantenimientos realizados al vehículo</p>
        <div className="table-wrapper">
          <table className="historial-table">
            <thead>
              <tr><th>N° Reparaciones</th><th>Fecha Ingreso</th><th>Fecha Salida</th><th>Tipo de Reparación</th><th>Mecánico Asignado</th><th>Estado</th><th>Observaciones</th></tr>
            </thead>
            <tbody>
              {historial.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td><td>{item.fechaIngreso}</td><td>{item.fechaSalida}</td><td>{item.tipo}</td><td>{item.mecanico}</td>
                  <td><span className={`status-historial ${item.estado.toLowerCase().replace(" ", "-")}`}>{item.estado}</span></td>
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

  // --- LÓGICA SLIDER ---
  const infiniteUsers = [...mockUsers, ...mockUsers, ...mockUsers];
  const START_INDEX = mockUsers.length; 

  const [selectedIndex, setSelectedIndex] = useState(START_INDEX);
  const [viewStartIndex, setViewStartIndex] = useState(START_INDEX);

  const usersSliderRef = useRef(null);
  const vehicleSliderRef = useRef(null);

  const handleShowHistory = () => setShowHistory(true);
  const handleBackFromHistory = () => setShowHistory(false);

  // 1. Scroll Sincronizado
  useEffect(() => {
    if (usersSliderRef.current) {
      const container = usersSliderRef.current;
      const cardWidth = container.clientWidth / 3; 
      container.scrollTo({ left: viewStartIndex * cardWidth, behavior: 'smooth' });
    }
  }, [viewStartIndex]);

  // 2. Lógica Infinita (Teletransporte)
  useEffect(() => {
    if (selectedIndex >= mockUsers.length * 2 + 1) {
      setTimeout(() => {
        const diff = selectedIndex - viewStartIndex;
        const newStart = mockUsers.length;
        if (usersSliderRef.current) {
            usersSliderRef.current.style.scrollBehavior = 'auto';
            setViewStartIndex(newStart);
            setSelectedIndex(newStart + diff);
            requestAnimationFrame(() => { if(usersSliderRef.current) usersSliderRef.current.style.scrollBehavior = 'smooth'; });
        }
      }, 300);
    } else if (selectedIndex < mockUsers.length - 1) {
      setTimeout(() => {
        const diff = selectedIndex - viewStartIndex;
        const newStart = mockUsers.length * 2 - 2; 
        if (usersSliderRef.current) {
            usersSliderRef.current.style.scrollBehavior = 'auto';
            setViewStartIndex(newStart);
            setSelectedIndex(newStart + diff);
            requestAnimationFrame(() => { if(usersSliderRef.current) usersSliderRef.current.style.scrollBehavior = 'smooth'; });
        }
      }, 300);
    }
  }, [selectedIndex, mockUsers.length]);

  // 3. Navegación
  const handleNavigation = (direction) => {
    if (direction === 'right') {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      if (nextIndex > viewStartIndex + 2) setViewStartIndex(prev => prev + 1);
    } else {
      const prevIndex = selectedIndex - 1;
      setSelectedIndex(prevIndex);
      if (prevIndex < viewStartIndex) setViewStartIndex(prev => prev - 1);
    }
  };

  const handleVehicleScroll = (direction) => {
    if (vehicleSliderRef.current) {
      const width = vehicleSliderRef.current.clientWidth;
      const amount = direction === 'left' ? -width : width;
      vehicleSliderRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const renderContent = () => {
    if (showHistory) return null;
    switch (activeView) {
      case "informacion": return <InformacionBasica />;
      case "consumo": return <ConsumoMantenimiento />;
      default: return <InformacionBasica />;
    }
  };

  return (
    <div className={`vehiculos-admin-container ${showHistory ? "history-visible" : ""}`}>
      <div className="background-shape"></div>

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
          <button className={`nav-button-admin ${activeView === "informacion" ? "active" : ""}`} onClick={() => setActiveView("informacion")}>
            <div className="icon"><CheckCircle size={18} /></div><span>Información básica</span>
          </button>
          <button className={`nav-button-admin ${activeView === "consumo" ? "active" : ""}`} onClick={() => setActiveView("consumo")}>
            <div className="icon"><Clock size={18} /></div><span>Consumo y mantenimiento</span>
          </button>
          <button className="nav-button-admin" onClick={handleShowHistory}>
            <div className="icon"><AlertTriangle size={18} /></div><span>Historial del vehículo</span>
          </button>
        </nav>

        <button onClick={() => handleVehicleScroll('left')} className="carousel-arrow" style={{position: 'absolute', top: '50%', left: '25%', zIndex: 10}}>
            <ChevronLeft size={24} />
        </button>

        <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none'}}>
            <div ref={vehicleSliderRef} style={{display: 'flex', width: '100%', height: '100%', overflowX: 'hidden', scrollBehavior: 'smooth', pointerEvents: 'auto'}}>
                <div style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
                    <div className="hero-car-image"><img src={vehiculo} alt="Toyota Corolla" /></div>
                    <div className="vehicle-card">
                        <div className="vehicle-card-header"><img src={logoToyota} alt="Logo Toyota" className="card-brand-logo" /><span>Toyota</span><button title="Editar" className="card-edit-button"><Edit size={16} /></button></div>
                        <img src={vehiculo} alt="Toyota Corolla" className="vehicle-card-image-main" />
                    </div>
                    <div className="vehicle-card-2">
                        <div className="vehicle-card-header"><img src={logoToyota} alt="Logo Toyota" className="card-brand-logo" /><span>Toyota</span><button title="Editar" className="card-edit-button"><Edit size={16} /></button></div>
                        <img src={vehiculo} alt="Toyota Corolla" className="vehicle-card-image-main" />
                    </div>
                </div>
                <div style={{ minWidth: '100%', height: '100%', position: 'relative' }}></div>
            </div>
        </div>
        <button onClick={() => handleVehicleScroll('right')} className="carousel-arrow" style={{position: 'absolute', top: '50%', right: '1rem', zIndex: 10}}>
            <ChevronRight size={24} />
        </button>
      </div>

      <footer className="slider-info">
        <div className="info-details">{renderContent()}</div>

        {/* SLIDER DE USUARIOS CORREGIDO */}
        <div className="other-drivers-carousel">
          <button className="carousel-arrow" onClick={() => handleNavigation('left')}>
            <ChevronLeft size={16} />
          </button>
          
          <div 
            className="slider-mask" 
            style={{
                width: '330px', 
                overflow: 'hidden', 
                margin: '0 10px', 
                display: 'flex',
                alignItems: 'center'
            }}
          >
            <div 
                ref={usersSliderRef}
                style={{
                    display: 'flex',        
                    flexDirection: 'row',   
                    overflowX: 'hidden',
                    width: '100%',
                    gap: '0',
                    alignItems: 'center',
                    padding: '10px 0',
                    pointerEvents: 'none'
                }}
            >
                {infiniteUsers.map((u, index) => {
                    const isActive = index === selectedIndex;

                    return (
                        // WRAPPER: ANCHO REDUCIDO A 33% PARA MARGEN DE ESCALA
                        <div 
                            key={`${u.id}-${index}`} 
                            style={{
                                // Base reducida a 33% (en vez de 33.33%) para dejar margen
                                flex: '0 0 33%', 
                                width: '33%',
                                padding: '0 20px',
                                boxSizing: 'border-box', // Asegura que el padding no cause desbordamiento
                                pointerEvents: 'auto'
                            }}
                        >
                            {/* LA CARD VISIBLE */}
                            <div 
                                className={`driver-avatar ${isActive ? "active" : ""}`} 
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    // Padding interno ligeramente reducido
                                    padding: '0.2rem', 
                                    
                                    // ESTILOS ANIMADOS
                                    transition: 'all 0.3s ease', 
                                    transform: isActive ? 'scale(1.05)' : 'scale(0.95)', 
                                    opacity: isActive ? 1 : 0.65,
                                    zIndex: isActive ? 10 : 1,
                                    
                                    backgroundColor: isActive ? '#1a1a1a' : 'transparent',
                                    border: isActive ? '2px solid #ff0000' : '2px solid transparent',
                                    borderRadius: '10px',
                                    boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.4)' : 'none',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    setSelectedIndex(index);
                                    if (index > viewStartIndex + 2) setViewStartIndex(index - 2);
                                    if (index < viewStartIndex) setViewStartIndex(index);
                                }}
                            >
                                <div className="avatar-icon" style={{
                                    backgroundColor: isActive ? '#ff0000' : 'rgba(255,0,0,0.15)',
                                    color: isActive ? '#fff' : 'inherit',
                                    transition: 'background 0.3s',
                                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                    marginBottom: '4px'
                                }}>
                                    <User size={20} />
                                </div>
                                <span style={{ 
                                    fontWeight: isActive ? '600' : 'normal',
                                    color: isActive ? '#fff' : '#999',
                                    fontSize: '0.75rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '100%'
                                }}>
                                    {u.name}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>

          <button className="carousel-arrow" onClick={() => handleNavigation('right')}>
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>

      {showHistory && <HistorialVehiculo onBack={handleBackFromHistory} />}
    </div>
  );
};

export default VehiculosAdmin;