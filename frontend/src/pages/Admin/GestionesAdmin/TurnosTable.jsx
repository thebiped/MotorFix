import React, { useState, useEffect, useMemo } from "react";
import {
  Wrench,
  Settings,
  Save,
  UserCheck,
  ShieldOff,
  XCircle,
} from "lucide-react";
import "./GestionesAdmin.css";

// Función StatusPill reutilizada (para consistencia visual, la dejamos aquí)
const StatusPill = ({ status }) => {
  const cls =
    status === "pendiente"
      ? "pill pending"
      : status === "finalizado"
      ? "pill done"
      : "pill progress";

  return (
    <div className="status-pill-wrap">
      <div className={cls}>{status}</div>
    </div>
  );
};

const TurnosTable = ({ filters, isAddModalOpen, onAddModalClose }) => {
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

  // 🔧 Datos de formulario dentro del modal de EDICIÓN
  const [editData, setEditData] = useState({
    tipo_reparacion: "",
    problema: "",
    estado: "",
    mecanico_id: "",
  });

  // ➕ NUEVOS ESTADOS para el Modal de Creación (Admin)
  const [clientes, setClientes] = useState([]);
  const [vehiculosAdmin, setVehiculosAdmin] = useState([]);

  const [modalClient, setModalClient] = useState(""); // ID del cliente seleccionado
  const [problema, setProblema] = useState(""); // Estado del formulario de creación
  const [tipoReparacion, setTipoReparacion] = useState(""); // Estado del formulario de creación
  const [vehiculoId, setVehiculoId] = useState(""); // Estado del formulario de creación

  // Filtra los vehículos del cliente seleccionado para el modal de creación
  const vehiculosClienteModal = useMemo(() => {
    // Asegura que modalClient sea tratado como string o number consistentemente
    const clientId = modalClient ? String(modalClient) : null;

    return vehiculosAdmin.filter(
      (v) =>
        // Compara el ID del cliente del vehículo con el ID seleccionado
        String(v.user_id ?? v.id_usuario) === clientId
    );
  }, [vehiculosAdmin, modalClient]);

  // 🔄 FUNCIONES DE FETCHING

  const fetchTurnos = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/turnos/all");
      const data = await res.json();
      console.log("🔎 /turnos/all devuelve:", data);

      if (Array.isArray(data)) {
        const turnosEnriquecidos = data.map((turno) => {
          // 1. Lógica de Cliente (Igual que antes)
          const userId = turno.user_id || turno.user?.id;
          const cliente = clientes.find(
            (c) => String(c.id_usuario) === String(userId)
          );
          const username =
            cliente?.username ||
            turno.user?.name ||
            (userId ? `ID Cliente #${userId}` : "Cliente Desconocido");

          // 2. Lógica de Mecánico (Igual que antes)
          let nombreMecanico = "Sin asignar";
          if (
            turno.mecanico &&
            turno.mecanico.name &&
            turno.mecanico.name !== "Sin asignar"
          ) {
            nombreMecanico = turno.mecanico.name;
          } else if (turno.mecanico_id || turno.mecanico?.id) {
            const idMec = turno.mecanico_id || turno.mecanico.id;
            const mecLocal = mecanicos.find(
              (m) => String(m.id_usuario) === String(idMec)
            );
            if (mecLocal) nombreMecanico = mecLocal.username;
          }

          // 3. 🚀 NUEVO: Mapeo de Fecha y Problema
          // El backend envía 'created_at', el frontend espera 'fecha_creado'
          const fecha =
            turno.created_at || turno.fecha_creado || new Date().toISOString();

          // El backend envía el problema dentro de 'turno.descripcion', el frontend espera 'problema'
          // Si 'turno.problema' ya existe en la raíz, úsalo, sino busca en el objeto anidado
          const problemaDesc =
            turno.problema || turno.turno?.descripcion || "Sin descripción";

          return {
            ...turno,
            username: username,
            user_id: userId,
            mecanico_nombre: nombreMecanico,
            mecanico_id: turno.mecanico_id || turno.mecanico?.id,

            // ✅ Asignamos las propiedades corregidas para que la tabla las lea
            fecha_creado: fecha,
            problema: problemaDesc,
          };
        });
        setTurnos(turnosEnriquecidos);
      } else {
        setTurnos([]);
      }
    } catch (err) {
      console.error("Error fetching turnos:", err);
      setTurnos([]);
    } finally {
      setLoading(false);
    }
  };

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

  // Función para obtener todos los clientes
  const fetchClientes = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users");
      const data = await res.json();
      if (Array.isArray(data)) {
        // Asumiendo que el campo para filtrar es 'rol'
        setClientes(data.filter((u) => u.rol === "cliente"));
      }
    } catch (err) {
      console.error("Error al obtener clientes:", err);
    }
  };

  // Función para obtener TODOS los vehículos (Admin)
  const fetchVehiculosAdmin = async () => {
    try {
      // **ASUMIMOS ESTE ENDPOINT EXISTE**
      const res = await fetch("http://localhost:3001/api/vehiculos/all");
      const data = await res.json();
      setVehiculosAdmin(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener vehículos del admin:", err);
    }
  };

  useEffect(() => {
    if (clientes.length > 0) {
      fetchTurnos(); // Esta función ahora usa el array 'clientes' ya poblado
    }
  }, [clientes]);

  // 🚀 HOOKS DE VIDA (useEffect)

  useEffect(() => {
    fetchMecanicos();
    fetchClientes();
    fetchVehiculosAdmin();
  }, []); // Carga inicial

  // Opcional: recargar mecánicos cuando abrís el modal (si querés siempre la lista más fresca)
  useEffect(() => {
    if (modalOpen) fetchMecanicos();
  }, [modalOpen]);

  // Resetea los estados de creación cuando el modal de ADD se cierra o se abre
  useEffect(() => {
    if (isAddModalOpen) {
      setModalClient("");
      setProblema("");
      setTipoReparacion("");
      setVehiculoId("");
    }
  }, [isAddModalOpen]);

  // 🔥 Formatear vehículo desde múltiples posibles keys
  const renderVehiculo = (t) => {
    // 1. Extraer los datos del vehículo. Busca en t.car (lo que devuelve /turnos/all) o en t directamente
    const vehicleData = t.car || t.vehicle || t;

    // Si no es un objeto válido, no podemos seguir.
    if (!vehicleData || typeof vehicleData !== "object") {
      return `Vehículo #${t.vehicle_id || "N/A"}`;
    }

    // 2. Extraer los campos usando los posibles aliases (patrón Brand/Model)
    const brand =
      vehicleData.brand || vehicleData.marca || vehicleData.brand_name || "";
    const model =
      vehicleData.model || vehicleData.modelo || vehicleData.model_name || "";
    const patente = vehicleData.patente || ""; // <--- Aseguramos que se captura la patente

    // 3. Formatear la salida
    if (brand || model || patente) {
      return `${brand} ${model}${patente ? " — " + patente : ""}`.trim();
    }

    // Retorno de fallback
    return `Vehículo #${vehicleData.id || vehicleData.vehicle_id || "N/A"}`;
  };

  // 🔄 LÓGICA DE FILTRADO Y PAGINACIÓN (existente)

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

  // 🔧 FUNCIONES DE ACCIÓN (existentes)

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
      } else {
        alert("Error al guardar cambios: " + (data.error || "desconocido"));
      }
    } catch (err) {
      console.error("Error update:", err);
      alert("Error al conectar con el servidor.");
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
      } else {
        alert("Error al cambiar estado: " + (data.error || "desconocido"));
      }
    } catch (err) {
      console.error("Error habilitado:", err);
      alert("Error al conectar con el servidor.");
    }
  };

  const asignarMecanico = async () => {
    if (!selectedTurno) return;
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

  // ➕ NUEVA FUNCIÓN: CREAR TURNO (ADMIN)
  const handleCrearTurnoAdmin = async () => {
    if (!modalClient || !vehiculoId || !problema || !tipoReparacion) {
      alert("Completa todos los campos y selecciona un cliente/vehículo.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/turnos/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: modalClient,
          vehicle_id: vehiculoId,
          problema,
          tipo_reparacion: tipoReparacion,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Turno creado exitosamente.");
        // Refrescar lista de turnos y limpiar estados
        fetchTurnos();
        onAddModalClose(); // Cierra el modal
        setModalClient("");
        setProblema("");
        setTipoReparacion("");
        setVehiculoId("");
      } else {
        alert(
          "Error al crear turno: " +
            (data.error || data.message || "Error desconocido")
        );
      }
    } catch (err) {
      console.error("Error al crear turno (Admin):", err);
      alert("Error al conectar con el servidor.");
    }
  };

  // 🚗 FUNCIÓN AUXILIAR PARA VEHÍCULO (adaptada de la versión anterior)
  const renderMarcaModelo = (v) => {
    const marca =
      v.marca ??
      v.brand ??
      v.nombre ??
      v.brand_name ??
      v.marca_nombre ??
      v.nombre_marca ??
      v.nombreBrand;
    const modelo =
      v.modelo ??
      v.model ??
      v.model_name ??
      v.nombre_modelo ??
      v.modelo_nombre ??
      v.nombreModel;
    const idModel = v.id_model ?? v.idModel ?? v.id_modelo ?? "";
    return `${marca ?? idModel ?? ""}${marca || idModel ? " " : ""}${
      modelo ?? ""
    }`.trim();
  };

  // ----------------------------------------------------
  // 🎨 RENDERIZADO DEL COMPONENTE
  // ----------------------------------------------------

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
                  <td colSpan="9" style={{ textAlign: "center", padding: 24 }}>
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
      {/* 💥 MODAL DE CREACIÓN DE TURNO (ADMIN) */}
      {isAddModalOpen && (
        <div className="admin-new-turno-modal-overlay">
          {/* Nuevo Overlay */}
          <div className="admin-turno-creacion-hud-panel">
            {/* Nuevo Panel Principal */}
            {/* DECORACIONES DE ESQUINA (HUD) */}
            <div className="panel-decoracion-hud-card top-left"></div>
            <div className="panel-decoracion-hud-card bottom-left"></div>
            <div className="panel-decoracion-hud-card top-right"></div>
            <div className="panel-decoracion-hud-card bottom-right"></div>
            {/* Contenido principal del modal */}
            <div className="modal-content-wrapper">
              <h3>Crear Nuevo Turno (Admin)</h3>

              <div className="field">
                <label>Seleccionar Cliente</label>
                <select
                  value={modalClient}
                  onChange={(e) => {
                    setModalClient(e.target.value);
                    setVehiculoId(""); // Limpiar el vehículo al cambiar de cliente
                  }}
                >
                  <option value="">-- Seleccionar cliente --</option>
                  {clientes.map((c) => (
                    <option key={c.id_usuario} value={c.id_usuario}>
                      {c.username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campos del formulario de Turno */}
              {modalClient ? (
                <>
                  <div className="field">
                    <label>Vehículo</label>
                    <select
                      value={vehiculoId}
                      onChange={(e) => setVehiculoId(e.target.value)}
                      disabled={vehiculosClienteModal.length === 0}
                    >
                      <option value="">Seleccionar vehículo</option>
                      {vehiculosClienteModal.map((v) => {
                        const id = v.id_vehiculo ?? v.id;
                        const label = `${renderMarcaModelo(v)}${
                          v.patente ? ` - ${v.patente}` : ""
                        }`.trim();
                        return (
                          <option key={id} value={id}>
                            {label || `vehículo #${id}`}
                          </option>
                        );
                      })}
                    </select>
                    {vehiculosClienteModal.length === 0 && (
                      <p className="error-message small">
                        ⚠️ El cliente no tiene vehículos registrados.
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label>Problema del vehículo</label>
                    <input
                      type="text"
                      value={problema}
                      onChange={(e) => setProblema(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>Tipo de reparación</label>
                    <select
                      value={tipoReparacion}
                      onChange={(e) => setTipoReparacion(e.target.value)}
                    >
                      <option value="">Seleccionar</option>
                      <option value="mecanica">Mecánica</option>
                      <option value="electrico">Eléctrico</option>
                      <option value="service">Service</option>
                      <option value="chapa">Chapa y pintura</option>
                    </select>
                  </div>

                  <div className="modal-actions">
                    <button className="btn-secondary" onClick={onAddModalClose}>
                      Cancelar
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleCrearTurnoAdmin}
                      disabled={
                        !vehiculoId ||
                        !problema ||
                        !tipoReparacion ||
                        vehiculosClienteModal.length === 0
                      }
                    >
                      Crear Turno
                    </button>
                  </div>
                </>
              ) : (
                <p className="info-message">
                  Selecciona un cliente para continuar con la creación del
                  turno.
                </p>
              )}
            </div>
            {/* Fin de modal-content-wrapper */}
          </div>
        </div>
      )}
      {/*  MODAL DE EDICIÓN Y GESTIÓN (existente) */}     
      {modalOpen && (
        // 1. OVERLAY PRINCIPAL (Fondo Oscuro)
        <div className="admin-edit-turno-modal-overlay">
          <div className="admin-turno-edicion-hud-panel">
            <div className="hud-corner-deco top-left"></div>
            <div className="hud-corner-deco bottom-left"></div>
            <div className="hud-corner-deco top-right"></div>
            <div className="hud-corner-deco bottom-right"></div>

            {/* COLUMNA IZQUIERDA — EDICIÓN */}
            <div className="col col-edicion">
              <h3 className="hud-titulo">
                <Wrench className="hud-icon" size={20} /> EDICIÓN DE TURNO
              </h3>

              {selectedTurno && (
                <p className="modal-info-turno">
                  TURNO #{selectedTurno.id_turno} PARA{" "}
                  {selectedTurno.username.toUpperCase()}
                </p>
              )}

              {/* Contenedor con Scroll */}
              <div className="col-content-scroll">
                {/* SECCIÓN VERTICAL 1: INFO BÁSICA Y REPARACIÓN */}
                <div className="panel-section-vertical">
                  <label className="hud-label">TIPO DE REPARACIÓN</label>
                  <input
                    type="text"
                    className="hud-input"
                    value={editData.tipo_reparacion}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        tipo_reparacion: e.target.value,
                      })
                    }
                  />

                  <label className="hud-label">DETALLE DEL PROBLEMA</label>
                  <textarea
                    className="hud-textarea"
                    value={editData.problema}
                    onChange={(e) =>
                      setEditData({ ...editData, problema: e.target.value })
                    }
                    rows="4"
                  />
                </div>
                <hr className="hud-divisor" />
              </div>
              {/* Fin col-content-scroll */}

              {/* SECCIÓN HORIZONTAL 2: ESTADO Y GUARDAR (Pegado al fondo) */}
              <div className="panel-section-horizontal">
                <div className="form-group-estado">
                  <label className="hud-label">ESTADO DEL TURNO</label>
                  <select
                    className="hud-select"
                    value={editData.estado}
                    onChange={(e) =>
                      setEditData({ ...editData, estado: e.target.value })
                    }
                  >
                    <option value="pendiente">PENDIENTE</option>
                    <option value="en proceso">EN PROCESO</option>
                    <option value="finalizado">FINALIZADO</option>
                    <option value="cancelado">CANCELADO</option>
                  </select>
                </div>
                <div className="btn-primary-guardar-container">
                  <button
                    className="hud-button hud-button-primary"
                    onClick={guardarCambios}
                  >
                    <Save className="hud-icon" size={18} /> GUARDAR CAMBIOS
                  </button>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA — GESTIÓN (CONTROL VERTICAL) */}
            <div className="col col-control">
              {/* Settings (Engranajes) para Gestión */}
              <h3 className="hud-titulo-control">
                <Settings className="hud-icon-control" size={20} /> GESTIÓN Y
                CONTROL
              </h3>

              {/* Contenedor con Scroll */}
              <div className="col-content-scroll">
                <div className="panel-section-vertical">
                  <label className="hud-label">ASIGNAR MECÁNICO</label>
                  <select
                    className="hud-select select-mecanico"
                    value={editData.mecanico_id}
                    onChange={(e) =>
                      setEditData({ ...editData, mecanico_id: e.target.value })
                    }
                  >
                    <option value="">-- SELECCIONAR MECÁNICO --</option>
                    {mecanicos.map((m) => (
                      <option key={m.id_usuario} value={m.id_usuario}>
                        {m.username.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <button
                    className="hud-button hud-button-secondary"
                    onClick={asignarMecanico}
                  >
                    <UserCheck className="hud-icon" size={18} /> ASIGNAR
                    MECÁNICO
                  </button>
                </div>

                <hr className="hud-divisor" />

                {/* SECCIÓN DE BOTONES DE CONTROL (Pegada al fondo) */}
                <div className="panel-section-vertical control-buttons">
                  <h3 className="hud-titulo-control">
                    <Settings className="hud-icon-control" size={20} /> Acciones irreversibles
                  </h3>
                  <button
                    className={`hud-button ${
                      selectedTurno?.habilitado === 1
                        ? "hud-button-danger"
                        : "hud-button-success"
                    }`}
                    onClick={() => toggleHabilitado(selectedTurno)}
                  >
                    {selectedTurno?.habilitado === 1 ? (
                      // ShieldOff para Deshabilitar
                      <ShieldOff className="hud-icon" size={18} />
                    ) : (
                      // UserCheck para Habilitar
                      <UserCheck className="hud-icon" size={18} />
                    )}{" "}
                    {selectedTurno?.habilitado === 1
                      ? "DESHABILITAR TURNO"
                      : "HABILITAR TURNO"}
                  </button>

                  <button
                    className="hud-button hud-button-close"
                    onClick={() => {
                      setSelectedTurno(null);
                      setModalOpen(false);
                    }}
                  >
                    CERRAR PANEL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnosTable;
