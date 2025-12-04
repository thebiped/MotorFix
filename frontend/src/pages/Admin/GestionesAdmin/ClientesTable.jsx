import { User, Mail, Tags, Save, X, Settings, UserCog, Monitor } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { FaRegUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";

// Componente simple de Modal para agregar un cliente (SIN CAMBIOS NECESARIOS)
const AddClienteModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rol: "cliente",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    setErrorMessage(""); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { username, email, password, rol } = formData;

    if (!username || !email || !password || !rol) {
      setErrorMessage("Debes completar todos los campos.");
      setLoading(false);
      return;
    }

    try {
      await onSave({ username, email, password, rol });
      setFormData({ username: "", email: "", password: "", rol: "cliente" });
      onClose(); // Cerrar el modal
    } catch (err) {
      const msg = err.message || "Error al crear el cliente. Intente de nuevo.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. OVERLAY PRINCIPAL
    <div className="admin-edit-cliente-hud-overlay">
      {/* 2. PANEL CONTENEDOR DE DOBLE COLUMNA */}
      <div className="admin-new-cliente-hud-panel">
        {/* DECORACIONES DE ESQUINA (Opcional, si quieres mantenerlas) */}
        <div className="hud-corner-deco-cliente top-left"></div>
        <div className="hud-corner-deco-cliente bottom-right"></div>

        {/* ======================================================= 
            COLUMNA 1: PERFIL/DECORACIÓN (Ficha/Expediente)
            ======================================================= */}
        <div className="col-perfil-hud-deco">
          <div className="perfil-deco-content">
            <Monitor className="logo-icon-placeholder" size={60} />
            <h4>EXPEDIENTE DIGITAL</h4>
            <p>NUEVO USUARIO</p>
            <p>NIVEL DE ACCESO: {formData.rol.toUpperCase()}</p>
          </div>

          <div
            style={{
              marginTop: "2rem",
              color: "#777",
              fontSize: "0.8rem",
              textAlign: "center",
            }}
          >
            <p>AUTORIZACIÓN REQUERIDA:</p>
            <p>ADMINISTRADOR DE DATOS</p>
          </div>
        </div>

        {/* ======================================================= 
            COLUMNA 2: FORMULARIO DE REGISTRO
            ======================================================= */}
        <div className="col-formulario-hud">
          <h3 className="hud-title-agregar">
            <UserCog className="hud-icon-title" size={20} /> ALTA DE USUARIO
          </h3>

          <form
            onSubmit={handleSubmit}
            style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            {/* GRUPO USERNAME */}
            <div className="form-group-hud">
              <label>USERNAME</label>
              <div className="input-box-hud">
                <FaRegUser size={20} />
                <input
                  name="username"
                  type="text"
                  placeholder="Nombre de usuario..."
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* GRUPO EMAIL */}
            <div className="form-group-hud">
              <label>EMAIL</label>
              <div className="input-box-hud">
                <MdOutlineEmail size={20} />
                <input
                  name="email"
                  type="email"
                  placeholder="Correo electrónico..."
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* GRUPO CONTRASEÑA */}
            <div className="form-group-hud">
              <label>CONTRASEÑA</label>
              <div className="input-box-hud">
                <CiLock size={20} />
                <input
                  name="password"
                  type="password"
                  placeholder="Contraseña..."
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* GRUPO ROL */}
            <div className="form-group-hud">
              <label>ROL DE ACCESO</label>
              <div className="input-box-hud">
                {/* Nota: No le ponemos icono para no romper el padding del select */}
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="hud-select-cliente" /* Reutilizamos la clase select */
                  style={{ paddingLeft: "1rem" }} /* Ajuste simple */
                >
                  <option value="cliente">CLIENTE</option>
                  <option value="admin">ADMIN</option>
                  <option value="mecanico">MECÁNICO</option>
                </select>
              </div>
            </div>

            {/* Mensaje de error (Usamos el estilo de error HUD) */}
            {errorMessage && (
              <div
                className="admin-turno-creacion-hud-panel error-message"
                style={{ margin: "10px 0", textAlign: "center" }}
              >
                ERROR: {errorMessage}
              </div>
            )}

            {/* FOOTER DE ACCIONES */}
            <div className="modal-actions-footer">
              <button
                type="button"
                className="hud-button-cliente hud-button-close-cliente"
                onClick={onClose}
                disabled={loading}
              >
                <X size={20} /> CANCELAR
              </button>
              <button
                type="submit"
                className="hud-button-cliente hud-button-primary-cliente"
                disabled={loading}
              >
                {loading ? (
                  "PROCESANDO..."
                ) : (
                  <>
                    <Save size={20} /> REGISTRAR CLIENTE
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// NUEVO COMPONENTE: MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
const DeleteConfirmationModal = ({ cliente, onClose, onConfirm }) => {
  if (!cliente) return null;

  return (
    <div className="admin-edit-cliente-hud-overlay">
      <div
        className="admin-edit-cliente-hud-panel simplified"
        style={{ width: "25rem", padding: "1.5rem" }}
      >
        {/* Decoraciones de Esquina */}
        <div className="hud-corner-deco-cliente top-left"></div>
        <div className="hud-corner-deco-cliente bottom-left"></div>
        <div className="hud-corner-deco-cliente top-right"></div>
        <div className="hud-corner-deco-cliente bottom-right"></div>

        <h3
          className="hud-titulo-cliente"
          style={{ color: "#ff2a2a", borderBottomColor: "#ff2a2a" }}
        >
          CONFIRMAR ELIMINACIÓN
        </h3>

        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "1.1rem",
          }}
        >
          <p>¿Estás seguro de que quieres eliminar a este cliente?</p>
          <p>
            CLIENTE #{cliente.id_usuario}:{cliente.username}
          </p>
          <p
            className="error-message"
            style={{ fontSize: "0.9rem", color: "#ff2a2a" }}
          >
            Esta acción es IRREVERSIBLE.
          </p>
        </div>

        <div className="modal-actions-cliente-footer">
          <button
            className="hud-button-cliente hud-button-close-cliente"
            onClick={onClose}
          >
            CANCELAR
          </button>
          <button
            className="hud-button-cliente hud-button-primary-cliente"
            onClick={() => onConfirm(cliente.id_usuario)}
            style={{ background: "#ff2a2a", color: "#000000" }}
          >
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
};

// MODIFICACIÓN: ClientesTable con el nuevo modal de eliminación
const ClientesTable = ({
  filters,
  isAddModalOpen,
  onAddModalClose,
  onAddCliente, // <--- Esta es la función del padre (GestionesAdmin.jsx)
}) => {
  const { search = "", statusFilter = "" } = filters || {};
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [editingCliente, setEditingCliente] = useState(null);
  const [deletingClienteId, setDeletingClienteId] = useState(null); // <-- NUEVO ESTADO
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Función para re-fetch o recargar
  const fetchClientes = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/users");
      const data = await res.json();
      if (Array.isArray(data)) {
        data.sort((a, b) => a.id_usuario - b.id_usuario);
        setClientes(data);
      } else setClientes([]);
    } catch (err) {
      console.error("Error fetching clientes:", err);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // ... dentro de ClientesTable
  const handleSaveAndReload = async (clienteData) => {
    try {
      console.log("1. Llamando a la API de creación...");
      await onAddCliente(clienteData); // Esta función es la que llama a /api/users
      console.log("2. API EXITOSA. Iniciando fetchClientes()...");
      await fetchClientes(); // Esta función recarga la lista
      console.log("3. Recarga finalizada. La tabla debería actualizarse.");
    } catch (error) {
      // Si ves este log, significa que onAddCliente FALLÓ con un error del servidor.
      console.error("4. Error capturado en handleSaveAndReload:", error);
      throw new Error(error.message || "Error desconocido al recargar.");
    }
  };
  // ...
  // Reset página al cambiar filtros
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // Filtrado
  const filtered = useMemo(() => {
    return clientes.filter((c) => {
      const matchesSearch =
        !search ||
        `${c.username} ${c.email}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || c.rol === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clientes, search, statusFilter]);

  // Paginación
  const pageSize = 5;
  const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Lógica de edición (sin cambios)
  const handleGuardarEdicion = async () => {
    // Lógica de edición
    const { id_usuario, username, email, rol } = editingCliente;

    // 1. Ocultar el modal de edición e iniciar el estado de carga
    const clienteActualizado = editingCliente; // Guardamos una referencia local
    setEditingCliente(null);
    setIsSaving(true);

    try {
      // Simular el proceso de 'Cargando datos y verificando...'
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulación de carga (1.5s)

      // 2. Ejecutar la llamada a la API
      const res = await fetch(`http://localhost:3001/api/users/${id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, rol }),
      });

      const data = await res.json();

      // 3. Manejo de respuesta
      if (data.success) {
        setClientes((prev) =>
          prev.map((c) =>
            c.id_usuario === id_usuario ? clienteActualizado : c
          )
        );

        // Mostrar mensaje de éxito
        setFeedbackMessage({
          type: "success",
          text: "Cliente actualizado correctamente.",
        });
      } else {
        // Mostrar mensaje de error de la API
        setFeedbackMessage({
          type: "error",
          text: "Error al actualizar: " + data.message,
        });
      }
    } catch (err) {
      console.error(err);
      // Mostrar mensaje de error de red/código
      setFeedbackMessage({
        type: "error",
        text: "Error de conexión o código al actualizar cliente.",
      });
    } finally {
      setIsSaving(false);
      // Establecemos un temporizador para que el mensaje de feedback desaparezca
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 4000); // 4 segundos visible
    }
  };

  // NUEVA LÓGICA DE ELIMINACIÓN CON MODAL
  const handleEliminar = (id) => {
    // Muestra el modal de confirmación en lugar de window.confirm
    setDeletingClienteId(id);
  };

  const handleConfirmarEliminar = async (id) => {
    // 1. Ocultar el modal e iniciar el estado de carga
    setDeletingClienteId(null);
    setIsSaving(true);

    try {
      // Simular el proceso de 'Cargando datos y verificando...'
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulación de carga (1.5s)

      const res = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setClientes((prev) => prev.filter((c) => c.id_usuario !== id));

        // Mostrar mensaje de éxito
        setFeedbackMessage({
          type: "success",
          text: "Cliente eliminado correctamente.",
        });
      } else {
        // Mostrar mensaje de error de la API
        setFeedbackMessage({
          type: "error",
          text: "Error al eliminar: " + data.message,
        });
      }
    } catch (err) {
      console.error(err);
      // Mostrar mensaje de error de red/código
      setFeedbackMessage({
        type: "error",
        text: "Error de conexión o código al eliminar cliente.",
      });
    } finally {
      setIsSaving(false);
      // Establecemos un temporizador para que el mensaje de feedback desaparezca
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 4000); // 4 segundos visible
    }
  };

  return (
    <div className="data-table-wrapper">
      {loading ? (
        <div style={{ textAlign: "center", padding: 24 }}>
          Cargando clientes...
        </div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: 24 }}>
                    No hay resultados
                  </td>
                </tr>
              )}
              {paged.map((c) => (
                <tr key={c.id_usuario}>
                  <td>{c.id_usuario}</td>
                  <td>{c.username}</td>
                  <td>{c.email}</td>
                  <td>
                    <span
                      className={`status ${
                        c.rol === "admin" ? "activo" : "confirmado"
                      }`}
                    >
                      {c.rol}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => setEditingCliente(c)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-borrar btn-danger" // Añadimos btn-danger para estilizar
                      onClick={() => handleEliminar(c.id_usuario)} // Llama a la nueva función que abre el modal
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Modal de edición */}
          {editingCliente && (
            // 1. OVERLAY PRINCIPAL (Fondo Oscuro)
            <div className="admin-edit-cliente-hud-overlay">
              {/* 2. PANEL LATERAL HUD (Contenedor principal con animación) */}
              <div className="admin-edit-cliente-hud-panel simplified">
                {/* DECORACIONES DE ESQUINA */}
                <div className="hud-corner-deco-cliente top-left"></div>
                <div className="hud-corner-deco-cliente bottom-left"></div>
                <div className="hud-corner-deco-cliente top-right"></div>
                <div className="hud-corner-deco-cliente bottom-right"></div>

                {/* CONTENIDO PRINCIPAL (Una sola columna) */}
                <div className="col-cliente-edit-hud-simplified">
                  <h3 className="hud-titulo-cliente">
                    <UserCog className="hud-icon-title" size={20} /> EDICIÓN DE
                    CLIENTE
                  </h3>

                  {/* Banner de Info del Cliente */}
                  <p className="modal-info-cliente">
                    CLIENTE #{editingCliente.id_usuario}
                    {editingCliente.username.toUpperCase()}
                  </p>

                  {/* Contenedor con Scroll para campos */}
                  <div className="col-content-scroll-cliente">
                    {/* SECCIÓN: USUARIO Y EMAIL */}
                    <div className="panel-section-vertical-cliente-hud">
                      <label className="hud-label-cliente">
                        <User size={14} /> USUARIO
                      </label>
                      <input
                        className="hud-input-cliente"
                        type="text"
                        value={editingCliente.username}
                        onChange={(e) =>
                          setEditingCliente({
                            ...editingCliente,
                            username: e.target.value,
                          })
                        }
                      />

                      <label className="hud-label-cliente">
                        <Mail size={14} /> EMAIL
                      </label>
                      <input
                        className="hud-input-cliente"
                        type="email"
                        value={editingCliente.email}
                        onChange={(e) =>
                          setEditingCliente({
                            ...editingCliente,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                    <hr className="hud-divisor-cliente" />

                    {/* SECCIÓN: ROL */}
                    <div className="panel-section-vertical-cliente-hud">
                      <label className="hud-label-cliente">
                        <Tags size={14} /> ROL
                      </label>
                      <select
                        className="hud-select-cliente"
                        value={editingCliente.rol}
                        onChange={(e) =>
                          setEditingCliente({
                            ...editingCliente,
                            rol: e.target.value,
                          })
                        }
                      >
                        <option value="cliente">CLIENTE</option>
                        <option value="admin">ADMIN</option>
                        <option value="mecanico">MECÁNICO</option>
                      </select>
                    </div>
                  </div>
                  {/* Fin col-content-scroll-cliente */}

                  {/* FOOTER DE ACCIONES */}
                  <div className="modal-actions-cliente-footer">
                    <button
                      className="hud-button-cliente hud-button-close-cliente"
                      onClick={() => setEditingCliente(null)}
                    >
                      CERRAR PANEL
                    </button>
                    <button
                      className="hud-button-cliente hud-button-primary-cliente"
                      onClick={handleGuardarEdicion}
                    >
                      GUARDAR CAMBIOS
                    </button>
                  </div>
                </div>
              </div>
              {/* Fin col-cliente-edit-hud-simplified */}
            </div>
          )}
          {/* MODAL DE AGREGAR CLIENTE */}
          <AddClienteModal
            isOpen={isAddModalOpen}
            onClose={onAddModalClose}
            onSave={handleSaveAndReload}
          />

          {/* MODAL DE ELIMINACIÓN (NUEVO) */}
          <DeleteConfirmationModal
            cliente={clientes.find((c) => c.id_usuario === deletingClienteId)} // Busca el objeto cliente por ID
            onClose={() => setDeletingClienteId(null)}
            onConfirm={handleConfirmarEliminar}
          />

          {/* Footer con paginación */}
          <div className="table-footer">
            <div className="rows-info">
              Mostrando {paged.length} de {filtered.length}
            </div>
            <div className="pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                {"<"}
              </button>
              {[...Array(Math.min(5, maxPage)).keys()].map((i) => (
                <button
                  key={i}
                  className={page === i + 1 ? "active" : ""}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              {maxPage > 5 && <span className="dots">...{maxPage}</span>}
              <button
                onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                disabled={page === maxPage}
              >
                {">"}
              </button>
            </div>
          </div>
        </>
      )}
      {/* Carga de Edición/Eliminación */}
      {isSaving && (
        <div className="admin-edit-cliente-hud-overlay-center">
          <div className="hud-saving-status">
            <h3 className="hud-titulo-cliente loading-title">
              <UserCog className="hud-icon-title" size={20} /> PROCESANDO
              CAMBIOS
            </h3>

            {/* Barra Oscura de Carga */}
            <div className="hud-loading-bar-container">
              <div className="hud-loading-bar-progress"></div>
            </div>

            {/* Texto de Verificación (Inventado) */}
            <p className="hud-loading-text">
              Cargando datos y verificando integridad de la cuenta...
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- 
  MODAL DE MENSAJE FINAL (Aparece después de la carga)
-------------------------------------------------------------- */}
      {feedbackMessage && (
        <div className="admin-edit-cliente-hud-overlay-center">
          <div
            className={`hud-feedback-panel ${
              feedbackMessage.type === "success" ? "success" : "error"
            }`}
          >
            <h3 className="feedback-title">
              {feedbackMessage.type === "success" ? " ÉXITO" : " ERROR"}
            </h3>
            <p className="feedback-text">{feedbackMessage.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientesTable;
