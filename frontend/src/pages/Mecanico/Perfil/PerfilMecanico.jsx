import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom"; // Importar useNavigate
import {
  Shield,
  Car,
  CheckCircle,
  Edit2,
  Lock,
  XCircle,
  AlertTriangle,
  Trash2,
  // LogOut no se usa directamente en el componente
} from "lucide-react";
// 🚩 Corregido: Si es PerfilMecanico, debe usar su propio CSS
import "./PerfilMecanico.css";
import banner from "../../../assets/img/banner.png";

// --- Componente: Modal de Confirmación HUD (Igual que en el código original) ---
const ConfirmationModal = ({ isOpen, type, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const isDelete = type === "delete";
  const title = isDelete
    ? "¿Eliminar Cuenta Permanentemente?"
    : "¿Desactivar Cuenta?";
  const message = isDelete
    ? "Esta acción es **definitiva e irreversible**. Todos tus datos (historial de servicio, calificaciones) se borrarán. ¿Deseas continuar?"
    : "Tu cuenta será temporalmente deshabilitada. Podrás reactivarla más tarde, pero se cerrará tu sesión. ¿Deseas continuar?";
  const confirmButtonText = isDelete ? "Eliminar Ahora" : "Sí, Desactivar";
  const confirmButtonClass = isDelete
    ? "btn-danger-confirm"
    : "btn-warning-confirm";
  const Icon = isDelete ? Trash2 : AlertTriangle;

  return (
    <div className="modal-overlay">
      <div
        className={`confirmation-modal hud-modal ${
          isDelete ? "delete-style" : "deactivate-style"
        }`}
      >
        <div className="modal-header">
          <Icon size={24} style={{ marginRight: "10px" }} />
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          <p dangerouslySetInnerHTML={{ __html: message }}></p>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            className={`btn-confirm ${confirmButtonClass}`}
            onClick={onConfirm}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Funciones de Utilidad (fetchUserData adaptada para Mecánico) ---

const fetchUserData = async (id) => {
  const API_URL = `http://localhost:3001/api/users/${id}`;
  const response = await fetch(API_URL);

  if (!response.ok) {
    let errorMessage = "Fallo al obtener datos";
    try {
      const errorBody = await response.json();
      if (errorBody && errorBody.message) {
        errorMessage = errorBody.message;
      }
    } catch (e) {
      errorMessage = `El servidor respondió con código ${response.status} y el cuerpo no pudo leerse.`;
    }
    throw new Error(`Error HTTP ${response.status}: ${errorMessage}`);
  }

  const rawData = await response.json();

  // ⚙️ DATOS ADAPTADOS PARA UN MECÁNICO
  return {
    id: rawData.id_usuario,
    name: rawData.username || "Mecánico Desconocido",
    role: rawData.rol || "Técnico Automotriz",
    description: rawData.especialidad
      ? `Especialidad: ${rawData.especialidad}`
      : rawData.email
      ? `Contacto principal: ${rawData.email}`
      : "Descripción de mecánico no disponible.",
    completedRepairs: rawData.reparaciones_realizadas || 125, // Simulación
    totalVehicles: rawData.clientes_atendidos || 80, // Simulación
    satisfactionRating: rawData.calificacion || "4.9/5.0", // Simulación
  };
};

// --- Componente: SecurityPanel (Igual que en el código original) ---
const SecurityPanel = ({ openDeactivateModal, openDeleteModal }) => (
  <div className="profile-security-panel">
    <div className="security-item">
      <Lock size={20} className="security-icon" />
      <div className="security-details">
        <h4>Contraseña y autenticación</h4>
        <p>Último cambio de contraseña: hace 45 días.</p>
      </div>
      <button className="change-password-btn">Cambiar Contraseña</button>
    </div>

    <div className="security-item danger-zone">
      <XCircle size={20} className="security-icon danger-icon" />
      <div className="security-details">
        <h4>Zona de Riesgo (Remover Cuenta)</h4>
        <p>Esta acción es irreversible. Solo procede si estás seguro.</p>
      </div>
      <div className="security-actions-container">
        {/* Asignamos la función para abrir el modal de desactivar */}
        <button
          className="deactivate-account-btn"
          onClick={openDeactivateModal}
        >
          Desactivar
        </button>
        {/* Asignamos la función para abrir el modal de eliminar */}
        <button className="delete-account-btn" onClick={openDeleteModal}>
          Eliminar
        </button>
      </div>
    </div>
  </div>
);

// --- Componente Principal: PerfilMecanico ---

const PerfilMecanico = () => {
  // ⚙️ Se espera 'mecanicoId' del contexto
  const { mecanicoId } = useOutletContext() || {};
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalType, setModalType] = useState(null);

  const openDeactivateModal = () => setModalType("deactivate");
  const openDeleteModal = () => setModalType("delete");
  const closeModal = () => setModalType(null);

  // --- Handlers de Acción ---

  const handleDeactivate = async () => {
    closeModal();

    if (!mecanicoId) {
      alert("Error: No se pudo identificar al mecánico para desactivar.");
      return;
    }

    const API_URL = `http://localhost:3001/api/users/${mecanicoId}`;

    try {
      const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activo: false }),
      });

      if (!response.ok) {
        let errorMsg = "Fallo al desactivar la cuenta.";
        try {
          const errorBody = await response.json();
          if (errorBody && errorBody.message) {
            errorMsg = errorBody.message;
          }
        } catch (e) {
          // Ignorar error de JSON
        }
        throw new Error(errorMsg);
      }

      alert(
        "✅ Tu cuenta de Mecánico ha sido desactivada temporalmente. ¡Esperamos verte pronto!"
      );

      // Limpiar sesión y redirigir
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Error al desactivar la cuenta:", err.message);
      alert(`Error de desactivación: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    closeModal();

    if (!mecanicoId) {
      alert("Error: No se pudo identificar al mecánico para eliminar.");
      return;
    }

    // 1. Llamada a la API para la eliminación
    const API_URL = `http://localhost:3001/api/users/${mecanicoId}`;

    try {
      const response = await fetch(API_URL, {
        method: "DELETE", // 🎯 Usa el método DELETE
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Manejo de la respuesta del servidor
      if (!response.ok) {
        let errorMsg = "Fallo al eliminar la cuenta. Intenta nuevamente.";
        try {
          const errorBody = await response.json();
          if (errorBody && errorBody.message) {
            errorMsg = errorBody.message;
          }
        } catch (e) {
          if (response.status === 404) {
            errorMsg = `El usuario con ID ${mecanicoId} ya no existe.`;
          }
        }
        throw new Error(errorMsg);
      }

      // 2. Si es exitoso
      alert("✅ Tu cuenta ha sido eliminada permanentemente. ¡Adiós!");

      // 3. Limpiar sesión y redirigir a la página de inicio
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Error al eliminar la cuenta:", err.message);
      alert(`Error de eliminación: ${err.message}`);
    }
  };

  // Función para manejar ediciones (simulación)
  const handleEditProfile = () => {
    console.log("Abrir modal/formulario de edición de perfil de Mecánico");
  };

  // 2. useEffect para cargar los datos del mecánico
  useEffect(() => {
    if (!mecanicoId) {
      console.warn("No se encontró el mecanicoId en el contexto.");
      setIsLoading(false);
      setError(
        "No se pudo obtener el ID del Mecánico del contexto. Asegúrate de estar logeado."
      );
      return;
    }

    const loadUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchUserData(mecanicoId);
        setUserData(data);
      } catch (err) {
        console.error("Error al cargar datos del mecánico:", err.message);
        setError(
          "No se pudieron cargar los datos del mecánico: " + err.message
        );
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [mecanicoId]);

  // 3. Manejo de estados de Carga/Error
  if (isLoading) {
    return (
      <div
        className="perfil-mecanico-container"
        style={{ padding: "50px", textAlign: "center" }}
      >
        <h3 style={{ color: "#fff" }}>Cargando datos del Mecánico...</h3>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div
        className="perfil-mecanico-container"
        style={{ padding: "50px", textAlign: "center" }}
      >
        <h3 style={{ color: "red" }}>
          {error || "Datos de mecánico no disponibles."}
        </h3>
        <p style={{ color: "#aaa" }}>
          Verifica la conexión o si el ID de usuario es válido:{" "}
          {mecanicoId || "N/A"}
        </p>
      </div>
    );
  }

  // 4. Renderizado con datos del Mecánico
  return (
    <div className="perfil-mecanico-container">
      {/* Modal de Confirmación */}
      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={modalType !== null}
        type={modalType}
        onClose={closeModal}
        onConfirm={modalType === "delete" ? handleDelete : handleDeactivate}
      />

      <div className="profile-header">
        <div className="profile-banner">
          {/* Reemplaza 'banner' con la importación correcta o una URL/ruta estática */}
          <img src={banner} alt="Banner de Perfil" />
        </div>

        <div className="profile-info-and-picture">
          <div className="profile-picture-container">
            {/* Aquí puedes reemplazar el div vacío con un componente de imagen real */}
            <div className="profile-picture"></div>
          </div>

          <div className="profile-header-info">
            <div className="header-info">
              <div className="info">
                <h2>{userData.name || "Usuario (Sin Nombre)"}</h2>
                <span className="user-role">
                  {userData.role || "Rol Desconocido"}
                </span>
              </div>
              <button className="edit-profile-btn" onClick={handleEditProfile}>
                <Edit2 size={16} style={{ marginRight: "5px" }} /> Editar perfil
              </button>
            </div>
            <p className="profile-description">
              {userData.description || "Descripción vacía."}
            </p>
          </div>
        </div>
      </div>

      <div className="profile-content-section">
        {/* Estadísticas de Mantenimiento (se mantienen) */}
        <div className="profile-stats-container">
          <div className="profile-stats">
            {/* ... Stats ... */}
            <div className="stat-item">
              <CheckCircle size={24} color="#fff" />
              <h3>{userData.completedRepairs}</h3>
              <p>Reparaciones Completadas</p>
            </div>
            <div className="stat-item">
              <Car size={24} color="#fff" />
              <h3>{userData.totalVehicles}</h3>
              <p>Vehículos Registrados</p>
            </div>
            <div className="stat-item">
              <Shield size={24} color="#fff" />
              <h3>{userData.satisfactionRating}</h3>
              <p>Satisfacción Promedio</p>
            </div>
          </div>
        </div>

        {/* Panel de Seguridad (Pasamos los handlers del modal) */}
        <div className="profile-content">
          <div className="profile-content-cont">
            <div className="content-title">
              <Lock size={20} style={{ marginRight: "10px" }} />
              <h3>Panel de Seguridad</h3>
            </div>
            <SecurityPanel
              openDeactivateModal={openDeactivateModal}
              openDeleteModal={openDeleteModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilMecanico;
