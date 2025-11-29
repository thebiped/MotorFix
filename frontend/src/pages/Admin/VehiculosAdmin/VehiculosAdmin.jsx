import { useState, useRef, useEffect, useMemo } from "react";
import {
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import "./VehiculosAdmin.css";

import InformacionBasica from "./InformacionBasica";
import ConsumoMantenimiento from "./ConsumoMantenimiento";
import HistorialVehiculo from "./HistorialVehiculo";

const VehiculosAdmin = () => {
  const [activeView, setActiveView] = useState("informacion");
  const [showHistory, setShowHistory] = useState(false);

  // --- USUARIOS CON VEHÍCULOS ---
  const [users, setUsers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const usersSliderRef = useRef(null);

  const currentUser = users[selectedIndex];
  const currentVehicle = currentUser?.vehiculos[currentVehicleIndex];

  // --- FETCH DATOS BACKEND ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/usuarios/conVehiculos"
        );
        const data = await res.json();
        const filtered = data.filter(
          (u) => u.vehiculos && u.vehiculos.length > 0
        );

        const mapped = filtered.map((u) => ({
          id: u.id_usuario,
          username: u.username,
          vehiculos: u.vehiculos.map((v) => ({
            id: v.id,
            brand: v.brand,
            name: v.name,
            image: v.image,
          })),
        }));

        setUsers(mapped);
        setSelectedIndex(0);
        setCurrentVehicleIndex(0);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      }
    };

    fetchUsers();
  }, []);

  // --- SLIDER VEHÍCULOS ---
  const handleVehicleNext = () => {
    if (!currentUser) return;
    setCurrentVehicleIndex((prev) => (prev + 1) % currentUser.vehiculos.length);
  };

  const handleVehiclePrev = () => {
    if (!currentUser) return;
    setCurrentVehicleIndex(
      (prev) =>
        (prev - 1 + currentUser.vehiculos.length) % currentUser.vehiculos.length
    );
  };

  // --- SLIDER USUARIOS ---
  const infiniteUsers = useMemo(() => [...users, ...users, ...users], [users]);
  const CENTER_INDEX = useMemo(() => users.length, [users]);

  useEffect(() => {
    if (usersSliderRef.current && users.length > 0) {
      const container = usersSliderRef.current;
      const cardWidth = container.clientWidth / 3;
      const scrollPos = (CENTER_INDEX + selectedIndex) * cardWidth - cardWidth;
      container.scrollTo({ left: scrollPos, behavior: "smooth" });
    }
  }, [selectedIndex, users, CENTER_INDEX]);

  const handleUserNav = (direction) => {
    if (!users.length) return;
    let nextIndex;
    if (direction === "right") {
      nextIndex = (selectedIndex + 1) % users.length;
    } else {
      nextIndex = (selectedIndex - 1 + users.length) % users.length;
    }
    setSelectedIndex(nextIndex);
    setCurrentVehicleIndex(0);
  };

  const renderContent = () => {
    if (showHistory) return null;
    return activeView === "informacion" ? (
      <InformacionBasica />
    ) : (
      <ConsumoMantenimiento />
    );
  };

  if (!users.length) return <div>Cargando usuarios con vehículos...</div>;

  return (
    <div
      className={`vehiculos-admin-container ${
        showHistory ? "history-visible" : ""
      }`}
    >
      <header className="vehiculo-header">
        <div className="brand-line">
          <h3 className="brand-title">{currentVehicle?.brand}</h3>
        </div>
        <div className="owner-details">
          <User size={28} className="owner-icon" />
          <div>
            <h1 className="owner-name">{currentUser?.name}</h1>
            <h2 className="car-model">{currentVehicle?.name}</h2>
          </div>
        </div>
      </header>

      <div className="slider-content">
        <nav className="view-selector">
          <button
            className={`nav-button-admin ${
              activeView === "informacion" ? "active" : ""
            }`}
            onClick={() => setActiveView("informacion")}
          >
            <CheckCircle size={18} /> Información básica
          </button>
          <button
            className={`nav-button-admin ${
              activeView === "consumo" ? "active" : ""
            }`}
            onClick={() => setActiveView("consumo")}
          >
            <Clock size={18} /> Consumo y mantenimiento
          </button>
          <button
            className="nav-button-admin"
            onClick={() => setShowHistory(true)}
          >
            <AlertTriangle size={18} /> Historial del vehículo
          </button>
        </nav>

        <div className="hero-car-section">
          <img
            key={currentVehicle?.id}
            src={currentVehicle?.image}
            alt={currentVehicle?.name}
            className={`hero-car-image`}
          />
          <button
            className="red-arrow-btn arrow-left"
            onClick={handleVehiclePrev}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="red-arrow-btn arrow-right"
            onClick={handleVehicleNext}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="cards-slider-section">
          <div
            className="cards-track"
            style={{ transform: `translateX(-${currentVehicleIndex * 220}px)` }}
          >
            {currentUser?.vehiculos.map((car, index) => (
              <div
                key={car.id}
                className={`vehicle-card-mini ${
                  index === currentVehicleIndex ? "active" : ""
                }`}
              >
                <div className="card-header-mini">
                  <div className="mini-brand">{car.brand}</div>
                  <Trash2
                    size={16}
                    color="#ff0000"
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <img src={car.image} className="mini-img" alt="mini car" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="slider-info">
        <div className="info-details">{renderContent()}</div>
        <div className="other-drivers-carousel">
          <button onClick={() => handleUserNav("left")}>
            <ChevronLeft size={16} />
          </button>
          <div className="slider-mask">
            <div ref={usersSliderRef} style={{ display: "flex" }}>
              {infiniteUsers.map((u, i) => {
                const isActive = i === CENTER_INDEX + selectedIndex;
                return (
                  <div
                    key={`${u.id}-${i}`}
                    className={`driver-avatar ${isActive ? "active" : ""}`}
                    onClick={() => {
                      setSelectedIndex(i % users.length);
                      setCurrentVehicleIndex(0);
                    }}
                  >
                    <User size={20} />
                    <span>{u.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <button onClick={() => handleUserNav("right")}>
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>

      {showHistory && (
        <HistorialVehiculo onBack={() => setShowHistory(false)} />
      )}
    </div>
  );
};

export default VehiculosAdmin;
