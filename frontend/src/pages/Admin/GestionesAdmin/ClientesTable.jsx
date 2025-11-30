// src/components/GestionesAdmin/ClientesTable.jsx

import React, { useEffect, useState, useMemo } from "react";
// Importa las dependencias necesarias.
import { FaRegUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";

// Componente simple de Modal para agregar un cliente (SIN CAMBIOS NECESARIOS)
const AddClienteModal = ({ isOpen, onClose, onSave }) => {
  // ... (El código de AddClienteModal es funcional y no necesita más cambios)
  // ...
  // ...
  // ...
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "", // Contraseña requerida
    rol: "cliente", // Rol por defecto
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Usamos loading para deshabilitar el botón

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
      // 1. Llamada a la función onSave (que ahora incluirá la recarga)
      await onSave({ username, email, password, rol });

      // 2. Si onSave tiene éxito:
      setFormData({ username: "", email: "", password: "", rol: "cliente" });
      onClose(); // Cerrar el modal
    } catch (err) {
      // 3. Si la API devuelve un error
      const msg = err.message || "Error al crear el cliente. Intente de nuevo.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay-admin">
      {/* Usamos la misma estructura de clases del formulario Register */}
      <div className="modal-content-admin register-form-section">
        <h3 className="register-title">Agregar Nuevo Cliente</h3>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-group">
            <label>Username</label>
            <div className="register-input-box">
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

          <div className="register-group">
            <label>Email</label>
            <div className="register-input-box">
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

          <div className="register-group">
            <label>Contraseña</label>
            <div className="register-input-box">
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

          <div className="register-group">
            <label>Rol</label>
            {/* El select simple puede no tener la misma clase de input-box, lo dejamos simple */}
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Admin</option>
              <option value="mecanico">Mecánico</option>
            </select>
          </div>

          {/* Mensaje de error (usando la clase de error del Register si existe) */}
          {errorMessage && (
            <div
              className="hud-error-message"
              style={{ margin: "10px 0", textAlign: "center" }}
            >
              ERROR: {errorMessage}
            </div>
          )}

          <div className="modal-actions register-button">
            <button
              type="button"
              className="btn-danger register-btn"
              onClick={onClose}
              disabled={loading} // Deshabilitar si está cargando
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="register-btn" // Usamos la clase de botón principal de Register para el estilo
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modificación para incluir el prop onClienteCreated
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

  // ... (Resto de las funciones de edición y eliminación sin cambios)

  // ... (Resto de las funciones de edición y eliminación sin cambios)
  const handleGuardarEdicion = async () => {
    // Lógica de edición
    const { id_usuario, username, email, rol } = editingCliente;
    try {
      const res = await fetch(`http://localhost:3001/api/users/${id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, rol }),
      });
      const data = await res.json();
      if (data.success) {
        setClientes((prev) =>
          prev.map((c) => (c.id_usuario === id_usuario ? editingCliente : c))
        );
        setEditingCliente(null);
        alert("Cliente actualizado correctamente");
      } else {
        alert("Error al actualizar: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar cliente");
    }
  };

  // Eliminar cliente
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este cliente?"))
      return;
    try {
      const res = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setClientes((prev) => prev.filter((c) => c.id_usuario !== id));
        alert("Cliente eliminado correctamente");
      } else {
        alert("Error al eliminar cliente: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error al eliminar cliente");
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
                      onClick={() => handleEliminar(c.id_usuario)}
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
            // CLASE CORREGIDA: 'modal-overlay-admin'
            <div className="modal-overlay-admin">
              {/* CLASE CORREGIDA: 'modal-content-admin' */}
              <div className="modal-content-admin">
                <h3>Editar Cliente: {editingCliente.username}</h3>

                {/* ESTRUCTURA DE DOS COLUMNAS APLICADA */}
                <div className="two-columns">
                  <div className="col">
                    <label>Usuario</label>
                    <input
                      value={editingCliente.username}
                      onChange={(e) =>
                        setEditingCliente({
                          ...editingCliente,
                          username: e.target.value,
                        })
                      }
                    />
                    <label>Email</label>
                    <input
                      value={editingCliente.email}
                      onChange={(e) =>
                        setEditingCliente({
                          ...editingCliente,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <label>Rol</label>
                    <select
                      value={editingCliente.rol}
                      onChange={(e) =>
                        setEditingCliente({
                          ...editingCliente,
                          rol: e.target.value,
                        })
                      }
                    >
                      <option value="cliente">Cliente</option>
                      <option value="admin">Admin</option>
                      <option value="mecanico">Mecánico</option>
                    </select>
                  </div>
                </div>

                <div
                  className="modal-actions"
                  style={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <button
                    className="btn-danger"
                    onClick={() => setEditingCliente(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn-success"
                    onClick={handleGuardarEdicion}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NUEVO MODAL DE AGREGAR CLIENTE */}
          <AddClienteModal
            isOpen={isAddModalOpen}
            onClose={onAddModalClose}
            onSave={handleSaveAndReload}
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
    </div>
  );
};

export default ClientesTable;
