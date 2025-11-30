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
  // LogOut, // No se usa en el componente final, pero estaba en la lista
} from "lucide-react";
import "./PerfilAdmin.css";
import banner from "../../../assets/img/banner.png";

// Componente: Modal de Confirmación HUD
const ConfirmationModal = ({ isOpen, type, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const isDelete = type === "delete";
  const title = isDelete
    ? "¿Eliminar Cuenta Permanentemente?"
    : "¿Desactivar Cuenta?";
  const message = isDelete
    ? "Esta acción es **definitiva e irreversible**. Todos tus datos (vehículos, historial de turnos) se borrarán. ¿Deseas continuar?"
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
// --- Funciones de Utilidad ---

const fetchUserData = async (id) => {
  // 🚩 RUTA CORREGIDA: Usando 'users'
  const API_URL = `http://localhost:3001/api/users/${id}`;
  // ... (El resto de la lógica de fetchUserData es la misma)
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

  return {
    id: rawData.id_usuario,
    name: rawData.username || "Usuario Desconocido",
    role: rawData.rol || "Rol no asignado",
    description: rawData.email
      ? `Contacto principal: ${rawData.email}`
      : "Descripción vacía.",
    completedRepairs: 0,
    totalVehicles: 0,
    satisfactionRating: "N/A",
  };
};

// --- Componente: SecurityPanel (Recibe handlers del padre) ---
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

// --- Componente Principal: PerfilCliente ---

const PerfilCliente = () => {
  const { userId } = useOutletContext() || {};
  const navigate = useNavigate(); // Hook para la redirección después de eliminar/desactivar

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado del Modal: puede ser 'deactivate', 'delete', o null (cerrado)
  const [modalType, setModalType] = useState(null);

  // Funciones para abrir/cerrar Modales
  const openDeactivateModal = () => setModalType("deactivate");
  const openDeleteModal = () => setModalType("delete");
  const closeModal = () => setModalType(null);

  // --- Handlers de Acción ---

  // Handler para Desactivar (Simulado)
  const handleDeactivate = async () => {
    closeModal();

    if (!userId) {
      alert("Error: No se pudo identificar el usuario para desactivar.");
      return;
    }

    const API_URL = `http://localhost:3001/api/users/${userId}`;

    try {
      const response = await fetch(API_URL, {
        method: "PATCH", // Usamos PATCH para actualizar parcialmente el recurso
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activo: false }), // Enviamos el campo a actualizar
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

      // Si es exitoso
      alert(
        "✅ Tu cuenta ha sido desactivada temporalmente. ¡Esperamos verte pronto!"
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
  // Handler para Eliminar (Simulado)
  const handleDelete = async () => {
    closeModal();

    if (!userId) {
      alert("Error: No se pudo identificar el usuario para eliminar.");
      return;
    }

    // 1. Llamada a la API para la eliminación
    const API_URL = `http://localhost:3001/api/users/${userId}`;

    try {
      const response = await fetch(API_URL, {
        method: "DELETE", // 🎯 Usa el método DELETE
        headers: {
          // Si usas tokens para autenticación (lo cual es recomendado)
          // Asegúrate de incluir el token aquí:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
      });

      // Manejo de la respuesta del servidor
      if (!response.ok) {
        // Intenta leer un mensaje de error del backend
        let errorMsg = "Fallo al eliminar la cuenta. Intenta nuevamente.";
        try {
          const errorBody = await response.json();
          if (errorBody && errorBody.message) {
            errorMsg = errorBody.message;
          }
        } catch (e) {
          // Si el backend no devuelve JSON
          if (response.status === 404) {
            errorMsg = `El usuario con ID ${userId} ya no existe.`;
          }
        }
        throw new Error(errorMsg);
      }

      // 2. Si es exitoso (Respuesta 200 o 204 No Content)
      alert("✅ Tu cuenta ha sido eliminada permanentemente. ¡Adiós!");

      // 3. Limpiar sesión y redirigir a la página de inicio
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Error al eliminar la cuenta:", err.message);
      alert(`Error de eliminación: ${err.message}`);
      // Puedes dejar el modal cerrado o reabrirlo con un mensaje de error
    }
  };

  // Función para manejar ediciones (simulación)
  const handleEditProfile = () => {
    console.log("Abrir modal/formulario de edición de perfil");
  };

  // 2. useEffect para cargar los datos del cliente
  useEffect(() => {
    if (!userId) {
      console.warn("No se encontró el userId en el contexto.");
      setIsLoading(false);
      setError(
        "No se pudo obtener el ID de usuario del contexto. Asegúrate de estar logeado."
      );
      return;
    }

    const loadUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchUserData(userId);
        setUserData(data);
      } catch (err) {
        console.error("Error al cargar datos del cliente:", err.message);
        setError("No se pudieron cargar los datos: " + err.message);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  // 3. Manejo de estados de Carga/Error
  if (isLoading) {
    return (
      <div
        className="perfil-cliente-container"
        style={{ padding: "50px", textAlign: "center" }}
      >
        <h3 style={{ color: "#fff" }}>Cargando datos del cliente...</h3>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div
        className="perfil-cliente-container"
        style={{ padding: "50px", textAlign: "center" }}
      >
        <h3 style={{ color: "red" }}>
          {error || "Datos de cliente no disponibles."}
        </h3>
        <p style={{ color: "#aaa" }}>
          Verifica la conexión o si el ID de usuario es válido:{" "}
          {userId || "N/A"}
        </p>
      </div>
    );
  }

  // 4. Renderizado con datos del cliente
  return (
    <div className="perfil-cliente-container">
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

export default PerfilCliente;