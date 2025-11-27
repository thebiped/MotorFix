import React, { useState, useEffect, useMemo } from "react";
import "./GestionesAdmin.css";

const TurnosTable = ({ filters }) => {
  const {
    search = "",
    statusFilter = "",
    dateFrom = "",
    dateTo = "",
  } = filters || {};

  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [mecanicos, setMecanicos] = useState([]);

  // 🔧 Datos de formulario dentro del modal
  const [editData, setEditData] = useState({
    tipo_reparacion: "",
    problema: "",
    estado: "",
    mecanico_id: "",
  });

  useEffect(() => {
    fetchMecanicos();
  }, []);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/turnos/all");
        const data = await res.json();

        console.log("🔎 /turnos/all devuelve:", data); // ← AÑADIR ESTO

        if (Array.isArray(data)) setTurnos(data);
        else setTurnos([]);
      } catch (err) {
        console.error("Error fetching turnos:", err);
        setTurnos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
  }, []);

  // dentro del componente TurnosTable (reemplaza la función fetchMecanicos y añade useEffect)
  const fetchMecanicos = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users");
      const data = await res.json();

      if (Array.isArray(data)) {
        const filtrados = data.filter((u) => u.rol === "mecanico");
        setMecanicos(filtrados);
      } else {
        setMecanicos([]);
      }
    } catch (err) {
      console.error("Error mecánicos:", err);
      setMecanicos([]);
    }
  };

  // cargar mecanicos al montar la tabla
  useEffect(() => {
    fetchMecanicos();
  }, []);

  // Opcional: recargar mecánicos cuando abrís el modal (si querés siempre la lista más fresca)
  useEffect(() => {
    if (modalOpen) fetchMecanicos();
  }, [modalOpen]);

  // 🔥 Formatear vehículo desde múltiples posibles keys
  const renderVehiculo = (t) => {
    const brand = t.brand || t.marca || t.brand_name || "";
    const model = t.model || t.modelo || t.model_name || "";
    const patente = t.patente || "";

    if (!brand && !model && !patente) return `Vehículo #${t.vehicle_id}`;

    return `${brand} ${model}${patente ? " — " + patente : ""}`.trim();
  };

  const filtered = useMemo(() => {
    return turnos.filter((t) => {
      const vehiculoFull = renderVehiculo(t).toLowerCase();
      const nombreCliente = (t.username || "").toLowerCase();

      const matchesSearch =
        !search ||
        nombreCliente.includes(search.toLowerCase()) ||
        vehiculoFull.includes(search.toLowerCase());

      const matchesStatus = !statusFilter || t.estado === statusFilter;

      const matchesFrom =
        !dateFrom || new Date(t.fecha_creado) >= new Date(dateFrom);
      const matchesTo = !dateTo || new Date(t.fecha_creado) <= new Date(dateTo);

      return matchesSearch && matchesStatus && matchesFrom && matchesTo;
    });
  }, [turnos, search, statusFilter, dateFrom, dateTo]);

  // 📄 Paginación
  const pageSize = 5;
  const [page, setPage] = useState(1);
  const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const onAcciones = (turno) => {
    setSelectedTurno(turno);
    setEditData({
      tipo_reparacion: turno.tipo_reparacion || "",
      problema: turno.problema || "",
      estado: turno.estado || "pendiente",
      mecanico_id: turno.mecanico_id || "",
    });
    setModalOpen(true);
  };

  const guardarCambios = async () => {
    if (!selectedTurno) return;

    try {
      const res = await fetch("http://localhost:3001/api/turnos/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_turno: selectedTurno.id_turno,
          tipo_reparacion: editData.tipo_reparacion,
          problema: editData.problema,
          estado: editData.estado,
          mecanico_id: editData.mecanico_id || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setTurnos((prev) =>
          prev.map((t) =>
            t.id_turno === selectedTurno.id_turno ? { ...t, ...editData } : t
          )
        );

        setModalOpen(false);
      }
    } catch (err) {
      console.error("Error update:", err);
    }
  };

  const toggleHabilitado = async (turno) => {
    try {
      const nuevoEstado = turno.habilitado === 1 ? 0 : 1;

      const res = await fetch(
        `http://localhost:3001/api/turnos/habilitado/${turno.id_turno}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ habilitado: nuevoEstado }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setTurnos((prev) =>
          prev.map((t) =>
            t.id_turno === turno.id_turno
              ? { ...t, habilitado: nuevoEstado }
              : t
          )
        );

        //FIX VISUAL
        setSelectedTurno({ ...turno, habilitado: nuevoEstado });
      }
    } catch (err) {
      console.error("Error habilitado:", err);
    }
  };

  // dentro del componente:
  const asignarMecanico = async () => {
    if (!selectedTurno) return;
    // editData.mecanico_id viene del select
    const mecanicoId = editData.mecanico_id;
    if (!mecanicoId) {
      alert("Seleccioná un mecánico primero.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/turnos/asignar/${selectedTurno.id_turno}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mecanico_id: mecanicoId }),
        }
      );

      const data = await res.json();
      console.log("Asignar respuesta:", data);

      if (data.success) {
        // Actualiza UI local sin recargar
        setTurnos((prev) =>
          prev.map((t) =>
            t.id_turno === selectedTurno.id_turno
              ? {
                  ...t,
                  mecanico_id: mecanicoId,
                  mecanico_nombre:
                    mecanicos.find((m) => m.id_usuario == mecanicoId)
                      ?.username || t.mecanico_nombre,
                }
              : t
          )
        );
        setSelectedTurno(null);
        setModalOpen(false);
      } else {
        alert("Error al asignar: " + (data.error || "desconocido"));
      }
    } catch (err) {
      console.error("Error al asignar mecánico:", err);
      alert("Error al asignar mecánico (ver consola).");
    }
  };

  return (
    <div className="data-table-wrapper">
      {loading ? (
        <div style={{ textAlign: "center", padding: 24 }}>
          Cargando turnos...
        </div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Tipo reparación</th>
                <th>Problema</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Mecánico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 24 }}>
                    No hay resultados
                  </td>
                </tr>
              )}

              {paged.map((t) => (
                <tr key={t.id_turno}>
                  <td>{t.id_turno}</td>
                  <td>{t.username || "Sin nombre"}</td>
                  <td>{renderVehiculo(t)}</td>
                  <td>{t.tipo_reparacion}</td>
                  <td>{t.problema}</td>
                  <td>{new Date(t.fecha_creado).toLocaleString()}</td>
                  <td>
                    <span className={`status ${t.estado?.toLowerCase()}`}>
                      {t.estado}
                    </span>
                  </td>
                  <td>{t.mecanico_nombre || "Sin asignar"}</td>

                  <td>
                    <button className="btn-small" onClick={() => onAcciones(t)}>
                      Acciones
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
                  onClick={() => setPage(i + 1)}
                  className={page === i + 1 ? "active" : ""}
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
      {modalOpen && (
        <div className="modal-overlay-admin">
          <div className="modal-content-admin two-columns">
            {/* COLUMNA IZQUIERDA — EDITAR */}
            <div className="col">
              <h3>Editar Turno</h3>

              <label>Tipo reparación</label>
              <input
                value={editData.tipo_reparacion}
                onChange={(e) =>
                  setEditData({ ...editData, tipo_reparacion: e.target.value })
                }
              />

              <label>Problema</label>
              <textarea
                value={editData.problema}
                onChange={(e) =>
                  setEditData({ ...editData, problema: e.target.value })
                }
              />

              <label>Estado</label>
              <select
                value={editData.estado}
                onChange={(e) =>
                  setEditData({ ...editData, estado: e.target.value })
                }
              >
                <option value="pendiente">Pendiente</option>
                <option value="en proceso">En proceso</option>
                <option value="finalizado">Finalizado</option>
                <option value="cancelado">Cancelado</option>
              </select>

              <button className="btn-primary" onClick={guardarCambios}>
                Guardar Cambios
              </button>
            </div>

            {/* COLUMNA DERECHA — GESTIÓN */}
            <div className="col">
              <h3>Gestión del Turno</h3>

              <label>Asignar mecánico</label>
              <select
                className="select-mecanico"
                value={editData.mecanico_id}
                onChange={(e) =>
                  setEditData({ ...editData, mecanico_id: e.target.value })
                }
              >
                <option value="">-- Seleccionar mecánico --</option>

                {mecanicos.map((m) => (
                  <option key={m.id_usuario} value={m.id_usuario}>
                    {m.username}
                  </option>
                ))}
              </select>

              <button className="btn-primary" onClick={asignarMecanico}>
                Asignar
              </button>

              <hr />

              <button
                className="btn-habilitar"
                onClick={() => toggleHabilitado(selectedTurno)}
              >
                {selectedTurno?.habilitado === 1 ? "Deshabilitar" : "Habilitar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnosTable;
