import { useState, useRef, useEffect } from "react";
import {
  User,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Trash2
} from "lucide-react";
import "./VehiculoCliente.css";

// Imagenes
import vehiculo from "../../../assets/img/toyota-corolla.png";
import logoToyota from "../../../assets/img/logo-toyota.png";

// --- IMPORTACIÓN DE COMPONENTES ---
import InformacionBasica from "./InformacionBasica";
import ConsumoMantenimiento from "./ConsumoMantenimiento";
import HistorialVehiculo from "./HistorialVehiculo";

// --- DATOS ---
const mockVehicles = [
  { id: 1, brand: "Toyota", name: "Toyota Corolla 2021", image: vehiculo },
  { id: 2, brand: "Toyota", name: "Toyota Corolla (Black)", image: vehiculo },
  { id: 3, brand: "Toyota", name: "Toyota Yaris Sport", image: vehiculo },
  { id: 4, brand: "Toyota", name: "Toyota Hilux", image: vehiculo },
];

const mockUsers = [
  { id: 1, name: "Juan Carlos" }, { id: 2, name: "Maria L." }, { id: 3, name: "Roberto" },
  { id: 4, name: "Ana P." }, { id: 5, name: "Pedro G." }, { id: 6, name: "Lucía M." },
  { id: 7, name: "Carlos R." },
];

// --- COMPONENTE PRINCIPAL ---
const VehiculoCliente = () => {
  const [activeView, setActiveView] = useState("informacion");
  const [showHistory, setShowHistory] = useState(false);

  // 1. ESTADOS SLIDER VEHÍCULOS
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next"); // Estado para controlar la dirección de la animación
  const currentVehicle = mockVehicles[currentVehicleIndex];

  // 2. ESTADOS SLIDER USUARIOS
  const infiniteUsers = [...mockUsers, ...mockUsers, ...mockUsers];
  const START_INDEX = mockUsers.length; 
  const [selectedIndex, setSelectedIndex] = useState(START_INDEX);
  const [viewStartIndex, setViewStartIndex] = useState(START_INDEX);
  const usersSliderRef = useRef(null);

  // --- HANDLERS VEHÍCULOS (Con lógica de dirección) ---
  const handleVehicleNext = () => {
    setSlideDirection("next"); // Indicamos que vamos a la derecha
    setCurrentVehicleIndex((prev) => (prev + 1) % mockVehicles.length);
  };

  const handleVehiclePrev = () => {
    setSlideDirection("prev"); // Indicamos que vamos a la izquierda
    setCurrentVehicleIndex((prev) => (prev - 1 + mockVehicles.length) % mockVehicles.length);
  };

  // --- HANDLERS USUARIOS ---
  useEffect(() => { 
    if (usersSliderRef.current) {
      const container = usersSliderRef.current;
      const cardWidth = container.clientWidth / 3; 
      container.scrollTo({ left: viewStartIndex * cardWidth, behavior: 'smooth' });
    }
  }, [viewStartIndex]);

  useEffect(() => { 
    if (selectedIndex >= mockUsers.length * 2 + 1) {
      setTimeout(() => {
        if (usersSliderRef.current) {
            usersSliderRef.current.style.scrollBehavior = 'auto';
            const diff = selectedIndex - viewStartIndex;
            const newStart = mockUsers.length;
            setViewStartIndex(newStart);
            setSelectedIndex(newStart + diff);
            requestAnimationFrame(() => { if(usersSliderRef.current) usersSliderRef.current.style.scrollBehavior = 'smooth'; });
        }
      }, 300);
    } else if (selectedIndex < mockUsers.length - 1) {
      setTimeout(() => {
        if (usersSliderRef.current) {
            usersSliderRef.current.style.scrollBehavior = 'auto';
            const diff = selectedIndex - viewStartIndex;
            const newStart = mockUsers.length * 2 - 2; 
            setViewStartIndex(newStart);
            setSelectedIndex(newStart + diff);
            requestAnimationFrame(() => { if(usersSliderRef.current) usersSliderRef.current.style.scrollBehavior = 'smooth'; });
        }
      }, 300);
    }
  }, [selectedIndex, mockUsers.length]);

  const handleUserNav = (direction) => {
    if (direction === 'right') {
      const next = selectedIndex + 1;
      setSelectedIndex(next);
      if (next > viewStartIndex + 2) setViewStartIndex(prev => prev + 1);
    } else {
      const prev = selectedIndex - 1;
      setSelectedIndex(prev);
      if (prev < viewStartIndex) setViewStartIndex(prev => prev - 1);
    }
  };

  const renderContent = () => {
    if (showHistory) return null;
    return activeView === "informacion" ? <InformacionBasica /> : <ConsumoMantenimiento />;
  };

  return (
    <div className={`vehiculos-admin-container ${showHistory ? "history-visible" : ""}`}>
      <div className="background-shape"></div>

      <header className="vehiculo-header">
        <div className="brand-line">
          <img src={logoToyota} alt="Toyota" className="brand-logo-vehiculo" />
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
        {/* COL 1: NAVBAR */}
        <nav className="view-selector">
          <button className={`nav-button-admin ${activeView === "informacion" ? "active" : ""}`} onClick={() => setActiveView("informacion")}>
            <div className="icon"><CheckCircle size={18} /></div><span>Información básica</span>
          </button>
          <button className={`nav-button-admin ${activeView === "consumo" ? "active" : ""}`} onClick={() => setActiveView("consumo")}>
            <div className="icon"><Clock size={18} /></div><span>Consumo y mantenimiento</span>
          </button>
          <button className="nav-button-admin" onClick={() => setShowHistory(true)}>
            <div className="icon"><AlertTriangle size={18} /></div><span>Historial del vehículo</span>
          </button>
        </nav>

        {/* COL 2: AUTO CENTRAL ANIMADO */}
        <div className="hero-car-section">
            {/* IMPORTANTE: 
               1. `key={currentVehicle.id}` obliga a React a destruir y recrear la img al cambiar de auto.
               2. `anim-${slideDirection}` aplica la clase CSS correcta (anim-next o anim-prev).
            */}
            <img 
                key={currentVehicle.id} 
                src={currentVehicle.image} 
                alt={currentVehicle.name} 
                className={`hero-car-image anim-${slideDirection}`} 
            />
            
            <button className="red-arrow-btn arrow-left" onClick={handleVehiclePrev}>
                <ChevronLeft size={24} />
            </button>
        </div>

        {/* COL 3: SLIDER CARDS */}
        <div className="cards-slider-section">
            <div className="cards-track" style={{ transform: `translateX(-${currentVehicleIndex * (220)}px)` }}>
                {mockVehicles.map((car, index) => (
                    <div key={car.id} className={`vehicle-card-mini ${index === currentVehicleIndex ? 'active' : ''}`}>
                        <div className="card-header-mini">
                            <div className="mini-brand"><img src={logoToyota} width={16} alt="logo"/> {car.brand}</div>
                            <Trash2 size={16} color="#ff0000" style={{cursor:'pointer'}} />
                        </div>
                        <img src={car.image} className="mini-img" alt="mini car" />
                    </div>
                ))}
            </div>
            <button className="red-arrow-btn arrow-right" onClick={handleVehicleNext}>
                <ChevronRight size={24} />
            </button>
        </div>
      </div>

      <footer className="slider-info">
        <div className="info-details">{renderContent()}</div>
        <div className="other-drivers-carousel">
          <button className="carousel-arrow" onClick={() => handleUserNav('left')}><ChevronLeft size={16} /></button>
          <div className="slider-mask" style={{width:'330px', overflow:'hidden', margin:'0 10px', display:'flex', alignItems:'center'}}>
            <div ref={usersSliderRef} style={{display:'flex', width:'100%', alignItems:'center', overflowX:'hidden', gap:'0', padding:'10px 0', pointerEvents:'none'}}>
                {infiniteUsers.map((u, i) => {
                    const isActive = i === selectedIndex;
                    return (
                        <div key={`${u.id}-${i}`} style={{flex:'0 0 33%', width:'33%', padding:'0 20px', boxSizing:'border-box', pointerEvents:'auto'}}>
                            <div className={`driver-avatar ${isActive ? "active" : ""}`} 
                                style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0.2rem', transition:'all 0.3s ease', transform: isActive ? 'scale(1.05)' : 'scale(0.95)', opacity: isActive ? 1 : 0.65, zIndex: isActive ? 10 : 1, backgroundColor: isActive ? '#1a1a1a' : 'transparent', border: isActive ? '2px solid #ff0000' : '2px solid transparent', borderRadius:'10px', cursor:'pointer'}}
                                onClick={()=>{setSelectedIndex(i); if (i > viewStartIndex + 2) setViewStartIndex(i - 2); if (i < viewStartIndex) setViewStartIndex(i);}}>
                                <div className="avatar-icon" style={{backgroundColor: isActive ? '#ff0000' : 'rgba(255,0,0,0.15)', borderRadius:'50%', width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'4px'}}>
                                    <User size={20} color="white"/>
                                </div>
                                <span style={{fontWeight: isActive ? '600' : 'normal', color: isActive ? '#fff' : '#999', fontSize:'0.75rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'100%'}}>{u.name}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
          <button className="carousel-arrow" onClick={() => handleUserNav('right')}><ChevronRight size={16} /></button>
        </div>
      </footer>

      {showHistory && <HistorialVehiculo onBack={() => setShowHistory(false)} />}
    </div>
  );
};

export default VehiculoCliente;