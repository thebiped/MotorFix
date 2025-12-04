import React, { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  User,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faBolt,
  faHorseHead,
  faCogs,
  faPalette,
  faIdCard,
  faTint,
  faGasPump,
  faStar,
  faRoad,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import "./VehiculoCliente.css";

// --- IMAGENES (Mocks de fallback eliminados) ---

// =========================================================================
// === 1. COMPONENTES DE MODAL (Add/Edit y Delete Confirmation) ============
// =========================================================================

const AddEditVehicleModal = ({ isOpen, onClose, vehicleData }) => {
  if (!isOpen) return null;
  const isEditing = !!vehicleData;
  const title = isEditing ? "Editar Vehículo" : "Registrar Nuevo Vehículo";

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>
          Marca y modelo: {vehicleData?.brand || "N/A"}{" "}
          {vehicleData?.model || "N/A"}
        </p>
        <form className="vehicle-select-form">
          <label>Marca:</label>
          <input type="text" defaultValue={vehicleData?.brand || ""} placeholder="Marca" />
          <label>Modelo:</label>
          <input type="text" defaultValue={vehicleData?.model || ""} placeholder="Modelo" />
          <label>Patente:</label>
          <input type="text" defaultValue={vehicleData?.patent || ""} placeholder="Patente" />
          <label>Kilometraje Actual:</label>
          <input type="number" defaultValue={vehicleData?.currentMileage?.replace(/\D/g, "") || ""} placeholder="Kilometraje (km)" />
          <label>Color:</label>
          <input type="text" defaultValue={vehicleData?.color || ""} placeholder="Color base" />
        </form>
        <div className="modal-actions">
          <button className="btn-primary" onClick={() => onClose()}>Guardar</button>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content modal-confirmation">
        <h2>Confirmar Eliminación</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn-danger" onClick={onConfirm}>Eliminar</button>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// === 2. COMPONENTES DE CONTENIDO DE PESTAÑA ==============================
// =========================================================================

const InformacionBasica = ({ vehicle }) => {
  return (
    <div className="informacion-basica-container">
      <div className="info-grid">
        <div className="info-item">
          <FontAwesomeIcon icon={faTachometerAlt} className="info-icon" />
          <span className="info-value">{vehicle.maxSpeed}</span>
          <span className="info-label">Velocidad máxima</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faBolt} className="info-icon" />
          <span className="info-value">{vehicle.acceleration}</span>
          <span className="info-label">0 a 100km/h</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faHorseHead} className="info-icon" />
          <span className="info-value">{vehicle.horsepower}</span>
          <span className="info-label">Potencia máxima</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faCogs} className="info-icon" />
          <span className="info-value">{vehicle.transmission}</span>
          <span className="info-label">Transmisión</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faPalette} className="info-icon" />
          <span className="info-value">{vehicle.color}</span>
          <span className="info-label">Color base</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faIdCard} className="info-icon" />
          <span className="info-value">{vehicle.patent}</span>
          <span className="info-label">Patente</span>
        </div>
      </div>
    </div>
  );
};

const ConsumoMantenimiento = ({ vehicle }) => {
  return (
    <div className="consumo-mantenimiento-container">
      <div className="info-grid">
        <div className="info-item">
          <FontAwesomeIcon icon={faTint} className="info-icon" />
          <span className="info-value">{vehicle.avgConsumption}</span>
          <span className="info-label">Consumo promedio</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faGasPump} className="info-icon" />
          <span className="info-value">{vehicle.tankCapacity}</span>
          <span className="info-label">Capacidad del tanque</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faStar} className="info-icon" />
          <span className="info-value">{vehicle.recommendedService}</span>
          <span className="info-label">Service-recomendado</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faRoad} className="info-icon" />
          <span className="info-value">{vehicle.currentMileage}</span>
          <span className="info-label">Kilometraje actual</span>
        </div>
      </div>
    </div>
  );
};

const HistorialVehiculo = ({ onBack, currentVehicle }) => {
  const reparaciones = currentVehicle.history || [];
  return (
    <div className="historial-vehiculo-container">
      <div className="historial-header">
        <button className="back-button" onClick={onBack}>
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </button>
        <h2>Historial del Vehículo: {currentVehicle.brand} {currentVehicle.model}</h2>
        <p>Historial de reparaciones y mantenimientos realizados al vehículo</p>
      </div>
      {reparaciones.length > 0 ? (
        <table className="historial-table">
          <thead>
            <tr>
              <th>N° Reparación</th><th>Fecha Ingreso</th><th>Fecha Salida</th><th>Tipo de Reparación</th><th>Mecánico Asignado</th><th>Estado</th><th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {reparaciones.map((rep, index) => (
              <tr key={index}>
                <td>{rep.id}</td><td>{rep.fechaIngreso}</td><td>{rep.fechaSalida}</td><td>{rep.tipo}</td><td>{rep.mecanico}</td>
                <td><span className={`status ${rep.estado.toLowerCase().replace(/ /g, "-")}`}>{rep.estado}</span></td>
                <td>{rep.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-history-message">Este vehículo no tiene historial de reparaciones registrado.</div>
      )}
    </div>
  );
};

// =========================================================================
// === 3. COMPONENTE PRINCIPAL: CLIENTE ====================================
// =========================================================================

const VehiculoCliente = () => {
  const { userId } = useOutletContext();

  const [clientVehicles, setClientVehicles] = useState([]);
  const [currentUser, setCurrentUser] = useState({ name: "Cargando usuario..." });
  const [isLoading, setIsLoading] = useState(false);

  const [activeView, setActiveView] = useState("informacion");
  const [showHistory, setShowHistory] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next");
  const cardsSliderSectionRef = useRef(null);

  // --- CONFIGURACIÓN DE RUTAS ---
  const API_BASE_URL = "http://localhost:3001"; 
  // Corrección: Tus imagenes se guardan en uploads/images, así que la URL debe reflejarlo
  const IMAGES_URL = "/uploads/images/"; 

  // Función auxiliar para limpiar la ruta que viene de la DB (quita C:\fakepath\ etc)
  const getFileName = (path) => {
    if (!path) return null;
    // Divide por / o \ y toma el último elemento (el nombre del archivo)
    return path.split(/[/\\]/).pop();
  };

  const placeholderVehicle = {
    id: null, brand: "Cargando", model: "Vehículo", patent: "N/A",
    image: null, logo: null,
    maxSpeed: "N/A", acceleration: "N/A", horsepower: "N/A", transmission: "N/A", color: "N/A",
    avgConsumption: "N/A", tankCapacity: "N/A", recommendedService: "N/A", currentMileage: "N/A", history: [],
  };

  const currentVehicle = clientVehicles[currentVehicleIndex] || placeholderVehicle;

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        if (userId) {
          console.log(`[VehiculoCliente] Fetching data for ID: ${userId}`);
          
          // 1. Usuario
          const userResponse = await fetch(`${API_BASE_URL}/api/users/${userId}`);
          if (!userResponse.ok) throw new Error("Error user");
          const userData = await userResponse.json();
          const clientName = userData.name || userData.username || `Usuario ID ${userId}`;
          setCurrentUser({ name: clientName, id: userId });

          // 2. Vehículos
          const vehiclesResponse = await fetch(`${API_BASE_URL}/api/vehiculos/user/${userId}`);
          if (!vehiclesResponse.ok) throw new Error("Error vehiculos");
          
          const rawVehicles = await vehiclesResponse.json();

          // --- AQUÍ ESTÁ LA CORRECCIÓN PRINCIPAL ---
          const formattedVehicles = rawVehicles.map((v) => {
            // Limpiamos la ruta para obtener solo el nombre del archivo
            const imageFile = getFileName(v.image_path);
            const logoFile = getFileName(v.logo_path);

            return {
              id: v.id_vehiculo,
              brand: v.marca || "Marca Desconocida",
              model: v.modelo || "Modelo Desconocido",
              patent: v.patente || "Sin Patente",
              
              // Construimos la URL completa: http://localhost:3001/uploads/images/archivo.png
              image: imageFile ? `${API_BASE_URL}${IMAGES_URL}${imageFile}` : null,
              logo: logoFile ? `${API_BASE_URL}${IMAGES_URL}${logoFile}` : null,

              maxSpeed: v.top_speed ? `${v.top_speed} km/h` : "N/A",
              acceleration: v.acceleration ? `${v.acceleration} s` : "N/A",
              horsepower: v.power ? `${v.power} hp` : "N/A",
              transmission: v.transmission || "N/A",
              color: v.color || "No especificado",
              avgConsumption: "N/A",
              tankCapacity: "N/A",
              recommendedService: "10.000 km",
              currentMileage: v.mileage ? `${v.mileage} km` : "0 km",
              history: [],
            };
          });

          setClientVehicles(formattedVehicles);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setClientVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [userId]);

  const handleVehicleNext = () => {
    if (clientVehicles.length <= 1) return;
    setSlideDirection("next");
    setCurrentVehicleIndex((prev) => (prev + 1) % clientVehicles.length);
  };

  const handleVehiclePrev = () => {
    if (clientVehicles.length <= 1) return;
    setSlideDirection("prev");
    setCurrentVehicleIndex((prev) => (prev - 1 + clientVehicles.length) % clientVehicles.length);
  };

  const handleAddVehicle = () => { setEditingVehicle(null); setIsAddEditModalOpen(true); };
  const handleEditVehicle = (vehicle) => { setEditingVehicle(vehicle); setIsAddEditModalOpen(true); };
  const handleDeleteVehicle = (vehicle) => { setVehicleToDelete(vehicle); setIsDeleteModalOpen(true); };
  const confirmDelete = () => { setIsDeleteModalOpen(false); setVehicleToDelete(null); };

  const renderContent = () => {
    if (isLoading) return <div className="loading-message">Cargando...</div>;
    if (clientVehicles.length === 0) return <div className="no-data-message">No hay vehículos.</div>;
    if (activeView === "informacion") return <InformacionBasica vehicle={currentVehicle} />;
    if (activeView === "consumo") return <ConsumoMantenimiento vehicle={currentVehicle} />;
    return null;
  };

  if (clientVehicles.length === 0 && !isLoading) {
    return (
      <div className="vehiculos-cliente-container no-vehicles-state">
        <div className="no-vehicles-content">
          <h2>¡Bienvenido, {currentUser.name}!</h2>
          <p>Parece que aún no tienes vehículos registrados.</p>
          <button className="add-vehicle-btn large" onClick={handleAddVehicle}><PlusCircle size={24} /> Registrar Mi Primer Vehículo</button>
        </div>
      </div>
    );
  }

  const cardWidth = 220;
  const containerWidth = 350;
  const offset = containerWidth / 2 - cardWidth / 2;
  const transformValue = `translateX(calc(${offset}px - ${currentVehicleIndex * cardWidth}px))`;

  return (
    <div className={`vehiculos-cliente-container ${showHistory ? "history-visible" : ""}`}>
      <div className="background-shape"></div>
      {isLoading && <div className="loading-overlay">Cargando...</div>}
      <header className="vehiculo-header">
      <img src={currentVehicle.logo} alt="" />
        <div className="owner-details">
          <User size={28} className="owner-icon" />
          <div>
            <h1 className="owner-name">{currentUser.name}</h1>
            <h2 className="car-model">{currentVehicle.model}</h2>
          </div>
        </div>
        <button className="add-vehicle-btn" onClick={handleAddVehicle}><PlusCircle size={20} /> Vehículos</button>
      </header>

      <div className="slider-content">
        <nav className="view-selector">
          <button className={`nav-button-admin ${activeView === "informacion" ? "active" : ""}`} onClick={() => { setActiveView("informacion"); setShowHistory(false); }}>
            <div className="icon"><CheckCircle size={18} /></div><span>Información básica</span>
          </button>
          <button className={`nav-button-admin ${activeView === "consumo" ? "active" : ""}`} onClick={() => { setActiveView("consumo"); setShowHistory(false); }}>
            <div className="icon"><Clock size={18} /></div><span>Consumo y mantenimiento</span>
          </button>
          <button className="nav-button-admin" onClick={() => setShowHistory(true)}>
            <div className="icon"><AlertTriangle size={18} /></div><span>Historial del vehículo</span>
          </button>
        </nav>

        <div className="hero-car-section">
          {currentVehicle.image ? (
            <img
              key={currentVehicle.id}
              src={currentVehicle.image}
              alt={currentVehicle.model}
              className={`hero-car-image anim-${slideDirection}`}
            />
          ) : (
            <div className="hero-car-image no-image-placeholder">Imagen no disponible</div>
          )}
          <button className="red-arrow-btn arrow-left" onClick={handleVehiclePrev} disabled={clientVehicles.length <= 1 || isLoading}><ChevronLeft size={24} /></button>
        </div>

        <div ref={cardsSliderSectionRef} className="cards-slider-section">
          <div className="cards-track" style={{ transform: transformValue }}>
            {clientVehicles.map((car, index) => (
              <div key={car.id} className={`vehicle-card-mini ${index === currentVehicleIndex ? "active" : ""}`} onClick={() => { if (index !== currentVehicleIndex) { setSlideDirection(index > currentVehicleIndex ? "next" : "prev"); setCurrentVehicleIndex(index); }}}>
                <div className="card-header-mini">
                  <div className="mini-brand">
                    {car.logo && <img src={car.logo} width={16} alt="logo" />}
                    {car.brand}
                  </div>
                  <div className="mini-actions">
                    <button className="mini-edit-btn" onClick={(e) => { e.stopPropagation(); handleEditVehicle(car); }}><Edit size={14} color="#00ff77" /></button>
                    <button className="mini-delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteVehicle(car); }}><Trash2 size={14} color="#ff0000" /></button>
                  </div>
                </div>
                <span className="mini-model">{car.model}</span>
                {car.image && <img src={car.image} className="mini-img" alt="mini car" />}
              </div>
            ))}
          </div>
          <button className="red-arrow-btn arrow-right" onClick={handleVehicleNext} disabled={clientVehicles.length <= 1 || isLoading}><ChevronRight size={24} /></button>
        </div>
      </div>

      <footer className="slider-info"><div className="info-details">{renderContent()}</div></footer>
      {showHistory && <HistorialVehiculo onBack={() => setShowHistory(false)} currentVehicle={currentVehicle} />}
      <AddEditVehicleModal isOpen={isAddEditModalOpen} onClose={() => setIsAddEditModalOpen(false)} vehicleData={editingVehicle} />
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} message={`¿Desea eliminar este vehículo?`} />
    </div>
  );
};

export default VehiculoCliente;