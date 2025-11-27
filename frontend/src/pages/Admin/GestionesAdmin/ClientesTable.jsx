import React, { useEffect, useState, useMemo } from "react";
import "./GestionesAdmin.css";

const ClientesTable = ({ filters }) => {
  const { search = "", statusFilter = "" } = filters || {};
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [editingCliente, setEditingCliente] = useState(null);

  // 1️⃣ Traer clientes del backend
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/users");
        const data = await res.json();
        if (Array.isArray(data)) {
          data.sort((a, b) => a.id_usuario - b.id_usuario); // Orden por id asc
          setClientes(data);
        } else setClientes([]);
      } catch (err) {
        console.error("Error fetching clientes:", err);
        setClientes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  // Reset página al cambiar filtros
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // 2️⃣ Filtrado
  const filtered = useMemo(() => {
    return clientes.filter((c) => {
      const matchesSearch =
        !search ||
        `${c.username} ${c.email}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || c.rol === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clientes, search, statusFilter]);

  // 3️⃣ Paginación
  const pageSize = 5;
  const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // 4️⃣ Editar cliente
  const handleGuardarEdicion = async () => {
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

  // 5️⃣ Eliminar cliente
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
                  <td>{c.rol}</td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => setEditingCliente(c)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-borrar"
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
            <div className="modal-overlay">
              <div className="modal">
                <h3>Editar Cliente</h3>
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

                <div className="modal-actions">
                  <button onClick={() => setEditingCliente(null)}>
                    Cancelar
                  </button>
                  <button onClick={handleGuardarEdicion}>Guardar</button>
                </div>
              </div>
            </div>
          )}

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
