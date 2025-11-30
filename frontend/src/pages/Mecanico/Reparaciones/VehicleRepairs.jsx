import React, { useState, useEffect } from "react";
import {
  FaCarCrash,
  FaWrench,
  FaTools,
  FaMicrochip,
  FaGasPump,
} from "react-icons/fa";
import { IoMdSpeedometer } from "react-icons/io";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import "./VehicleRepairs.css";

const PLACEHOLDER_CAR =
  "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect fill='%23000' width='100%25' height='100%25'/><text x='50%25' y='50%25' font-size='18' fill='%23fff' alignment-baseline='middle' text-anchor='middle'>NO IMAGE</text></svg>";

const VehicleRepairs = () => {
  // Obtenemos el ID del mecánico del contexto de React Router
  const { mecanicoId } = useOutletContext();

  // Estado principal de la aplicación
  const [repairs, setRepairs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado local para determinar si la tarea SELECCIONADA está aceptada
  const [isTaskAccepted, setIsTaskAccepted] = useState(false);

  // ✨ ESTADO PARA EL PANEL DE DIAGNÓSTICO (Slider)
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  // ✨ ESTADO para las notas de diagnóstico
  const [diagnosticNotes, setDiagnosticNotes] = useState({
    initialObservation: "",
    scannerResults: "",
    recommendedActions: "",
  });

  // ===================================
  // 1. LÓGICA DE OBTENCIÓN DE DATOS (Fetch Real)
  // ===================================
  const fetchRepairs = async () => {
    if (!mecanicoId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        // URL de ejemplo, adaptada para obtener turnos asignados a este mecánico
        `http://localhost:3001/api/turnos/mecanico/${mecanicoId}`
      );

      setRepairs(data);

      // Si teníamos un turno seleccionado, lo actualizamos con los datos nuevos
      if (selected) {
        const updatedSelected = data.find((r) => r.id === selected.id);
        setSelected(updatedSelected || null);
        setIsTaskAccepted(
          updatedSelected ? updatedSelected.estado === "en proceso" : false
        );
      }
    } catch (err) {
      console.error("Error fetching reparaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mecanicoId]);

  // ===================================
  // 2. LÓGICA DE SELECCIÓN Y GESTIÓN DE MODAL/PANEL
  // ===================================
  const selectRepair = (repair) => {
    // Si cambiamos de turno, cerramos el diagnóstico y reiniciamos las notas
    setSelected(repair);
    setIsDiagnosticsOpen(false);
    setDiagnosticNotes({
      initialObservation: "",
      scannerResults: "",
      recommendedActions: "",
    });

    // Asumimos que "en proceso" significa aceptada.
    setIsTaskAccepted(repair.estado === "en proceso");
  };

  const closeDetail = () => {
    setSelected(null);
    setIsDiagnosticsOpen(false); // Aseguramos que el diagnóstico se cierre si cerramos el detalle
  };

  // Lógica para abrir/cerrar Diagnóstico (toggle)
  const toggleDiagnostics = () => {
    // Solo permitimos abrir si hay un turno seleccionado y aceptado
    if (selected && isTaskAccepted) {
      setIsDiagnosticsOpen((prev) => !prev);
    }
  };

  const runDiagnostics = toggleDiagnostics;

  // Manejar cambios en los campos de texto del diagnóstico
  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setDiagnosticNotes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===================================
  // ✨ LÓGICA DE GUARDADO DE DIAGNÓSTICO
  // ===================================
  const handleSaveDiagnostics = async () => {
    if (!selected) return;

    // 1. Validar que al menos se haya escrito algo (opcional pero recomendado)
    if (
      !diagnosticNotes.initialObservation &&
      !diagnosticNotes.scannerResults &&
      !diagnosticNotes.recommendedActions
    ) {
      alert(
        "Por favor, ingresa al menos una nota de diagnóstico antes de guardar."
      );
      return;
    }

    try {
      // 2. Endpoint PUT: Se dirige al nuevo endpoint que crearemos en el backend.
      // Aquí estamos ASUMIENDO que las notas de diagnóstico se guardarán
      // en la misma tabla 'turnos', en nuevas columnas.
      await axios.put(
        `http://localhost:3001/api/turnos/diagnostico/${selected.id}`,
        {
          // Envía las tres notas de diagnóstico
          initialObservation: diagnosticNotes.initialObservation,
          scannerResults: diagnosticNotes.scannerResults,
          recommendedActions: diagnosticNotes.recommendedActions,
        }
      );

      // 3. Respuesta y actualización de UI
      alert("Diagnóstico guardado exitosamente.");
      setIsDiagnosticsOpen(false);
      // fetchRepairs(); // Opcional: para recargar y ver si las notas se reflejan
    } catch (error) {
      console.error(
        "Error al guardar el diagnóstico:",
        error.response?.data || error.message
      );
      alert(
        "Error al guardar el diagnóstico. Por favor, revisa la consola para más detalles."
      );
    }
  };

  // ===================================
  // 3. LÓGICA DE BOTONES (Aceptar/Rechazar/Completar)
  // ===================================

  const handleAcceptTask = async () => {
    if (!selected) return;

    try {
      // 1. **ACTUALIZAR ESTADO DEL TURNO a 'en proceso'**
      await axios.put(
        `http://localhost:3001/api/turnos/asignar/${selected.id}`,
        {
          mecanico_id: mecanicoId,
          estado: "en proceso",
        }
      );

      // 2. **✅ PASO CLAVE SOLICITADO: CREAR EL REGISTRO EN LA TABLA REPARACIONES**
      // Creamos una descripción inicial simple para cumplir con el requisito de guardar.
      const initialRepairDescription = `Registro inicial de reparación. Problema reportado: ${
        selected.turno?.descripcion || "No especificado"
      }.`;

      await axios.post(`http://localhost:3001/api/reparaciones/crear`, {
        id_turno: selected.id,
        id_mecanico: mecanicoId,
        // Se usa 'id' del objeto car que corresponde a 'v.id_vehiculo' del SQL.
        id_vehiculo: selected.car.id,
        descripcion_reparacion: initialRepairDescription,
      });
      // -------------------------------------------------------------------------

      // 3. Actualización de UI
      setIsTaskAccepted(true);
      const updatedRepair = { ...selected, estado: "en proceso" };
      setSelected(updatedRepair);

      setRepairs((prev) =>
        prev.map((r) => (r.id === selected.id ? updatedRepair : r))
      );

      alert(
        "Tarea confirmada y registro de reparación inicial guardado exitosamente."
      );
    } catch (error) {
      console.error(
        "Error al confirmar la tarea o guardar el registro inicial:",
        error.response?.data || error.message
      );
      alert(
        "Error al confirmar la tarea. Por favor, revisa la consola para más detalles."
      );
    }
  };

  const handleRejectTask = async () => {
    if (!selected) return;

    try {
      // Llamada al backend para RECHAZAR (desasignar)
      await axios.put(
        `http://localhost:3001/api/turnos/asignar/${selected.id}`,
        {
          mecanico_id: null,
          estado: "pendiente",
        }
      );

      // Lógica de ÉXITO (Actualización de UI)
      // En lugar de filtrar, lo marcamos como no asignado para que desaparezca de la lista
      setRepairs(repairs.filter((r) => r.id !== selected.id));
      setSelected(null); // Cierra el detalle
    } catch (error) {
      console.error(
        "Error al rechazar el turno:",
        error.response?.data || error.message
      );
    }
  };

  // ===================================
  // ✨ NUEVA LÓGICA: COMPLETAR TAREA
  // ===================================
  const handleCompleteTask = async () => {
    if (!selected || selected.estado !== "en proceso") return;

    const confirmation = window.confirm(
      "ATENCIÓN: ¿Estás seguro de que la reparación ha finalizado? Esta acción cerrará el turno."
    );
    if (!confirmation) return;

    try {
      // --- PASO 1: CONSTRUIR LA DESCRIPCIÓN FINAL ---
      // Usaremos las notas de diagnóstico que ya están en el estado local (diagnosticNotes)
      // para crear una descripción completa para el informe de reparaciones.

      const finalRepairDescription = `
            **Diagnóstico Inicial:** ${
              diagnosticNotes.initialObservation ||
              selected.diagnostico_observacion_inicial ||
              "N/A"
            }
            **Resultados del Scanner:** ${
              diagnosticNotes.scannerResults ||
              selected.diagnostico_resultados_scanner ||
              "N/A"
            }
            **Acciones Realizadas:** ${
              diagnosticNotes.recommendedActions ||
              selected.diagnostico_acciones_recomendadas ||
              "N/A"
            }
            ---
            REPARACIÓN COMPLETADA.
        `.trim();

      // --- PASO 2: ACTUALIZAR EL REGISTRO EN LA TABLA REPARACIONES ---
      // Usamos el id del turno (selected.id) para encontrar el registro de reparación.
      // Asumo que tienes un endpoint PUT para actualizar reparaciones por ID de turno.
      await axios.put(
        `http://localhost:3001/api/reparaciones/finalizar/${selected.id}`,
        {
          // Enviamos el ID del mecánico y la descripción final
          descripcion_reparacion: finalRepairDescription,
          id_mecanico: mecanicoId,
        }
      );

      // --- PASO 3: CERRAR EL TURNO EN LA TABLA TURNOS ---
      await axios.put(
        `http://localhost:3001/api/turnos/completar/${selected.id}`,
        {
          estado: "completado",
        }
      ); // Actualización de UI

      alert(
        "Tarea marcada como completada. El informe de reparación ha sido finalizado."
      );
      const updatedRepair = { ...selected, estado: "completado" };
      setSelected(updatedRepair);

      setRepairs((prev) =>
        prev.map((r) => (r.id === selected.id ? updatedRepair : r))
      );
    } catch (error) {
      console.error(
        "Error al completar la tarea/finalizar reparación:",
        error.response?.data || error.message
      );
      alert(
        "Error al finalizar la tarea. Por favor, revisa la consola para más detalles."
      );
    }
  };

  // ===================================
  // 4. RENDERIZADO
  // ===================================
  return (
    <div className="hud-container-reparacion">
      {/* LOADER */}
      {loading && (
        <div className="hud-loader-overlay">
          <div className="hud-loader-box">
            <div className="hud-loader-title">SYSTEM ACTIVATING...</div>
            <div className="hud-progress-bar">
              <div className="hud-progress-fill"></div>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* PANEL IZQUIERDO (LISTA) */}
          <div className="hud-panel left-panel">
            <div className="repair-lists-wrapper">
              <div className="list-section">
                {/* Decoraciones de esquina */}
                <div className="panel-decor top-left"></div>
                <div className="panel-decor bottom-left"></div>

                <h2 className="panel-title">REPARACIONES ASIGNADAS</h2>
                <div className="repair-list-scroll">
                  {repairs.length === 0 && (
                    <p className="empty-list-message">
                      No hay turnos asignados a tu ID de mecánico.
                    </p>
                  )}
                  {repairs.map((r) => (
                    <div
                      key={r.id}
                      className={`repair-block ${
                        selected?.id === r.id ? "selected-block" : ""
                      } ${r.estado === "completado" ? "completed-block" : ""}`}
                      onClick={() => selectRepair(r)}
                    >
                      <div className="block-header">
                        <span className="client-name">
                          {r.user?.name || "Cliente Desconocido"}
                        </span>
                        <span
                          className={`priority-badge ${r.prioridad.toLowerCase()} ${
                            r.estado === "completado" ? "completed" : ""
                          }`}
                        >
                          {r.estado === "completado"
                            ? "FINALIZADO"
                            : r.prioridad}
                        </span>
                      </div>
                      <div className="block-body">
                        <p className="problem-text">
                          {r.turno?.descripcion?.toUpperCase()}
                        </p>
                        <p className="car-text">
                          {r.car?.brand} {r.car?.model} ({r.car?.patente})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PANEL DERECHO (DETALLE) */}
          <div className={`hud-panel right-panel ${selected ? "active" : ""}`}>
            <div className="panel-decor top-right"></div>
            <div className="panel-decor bottom-right"></div>

            {!selected ? (
              <div className="empty-message">
                SELECCIONE UN TURNO PARA GESTIONAR
              </div>
            ) : (
              <div className="right-panel-content">
                <div className="rp-header">
                  <div className="brand-tag">{selected.car?.brand}</div>
                  <h1 className="model-title">{selected.car?.model}</h1>
                </div>

                <div className="rp-body">
                  <div className="car-display-area">
                    <img
                      src={
                        selected.car?.image_url ||
                        selected.car?.image_path ||
                        PLACEHOLDER_CAR
                      }
                      alt="Car"
                      className="main-car-img"
                    />
                  </div>

                  <div className="details-card">
                    <h3>DETALLES DEL TURNO</h3>
                    <div className="detail-row">
                      <span className="label">Problema:</span>
                      <span className="value">
                        {selected.turno?.descripcion}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Estado Actual:</span>
                      <span
                        className={`value ${
                          !isTaskAccepted ? "status-pending" : "status-active"
                        }`}
                      >
                        {selected.estado === "en proceso"
                          ? "EN PROGRESO"
                          : selected.estado === "completado"
                          ? "COMPLETADO"
                          : "PENDIENTE DE CONFIRMACIÓN"}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Patente:</span>
                      <span className="value">{selected.car?.patente}</span>
                    </div>
                  </div>
                </div>

                {/* --- FOOTER CON LÓGICA DE BOTONES --- */}
                <div className="rp-footer">
                  {/* Mostrar las estadísticas del vehículo */}
                  <div className="stats-group">
                    <div className="stat-box">
                      <span className="stat-label">
                        <IoMdSpeedometer /> VEL. MÁX.
                      </span>
                      <span className="stat-num">
                        {selected.car?.top_speed
                          ? selected.car.top_speed
                          : "--"}
                        <small> km/h</small>
                      </span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">
                        <FaMicrochip /> ACELERACIÓN
                      </span>
                      <span className="stat-num">
                        {selected.car?.acceleration
                          ? selected.car.acceleration
                          : "--"}
                        <small> seg (0-100)</small>
                      </span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">
                        <FaGasPump /> CONSUMO
                      </span>
                      <span className="stat-num">
                        {selected.car?.fuel_consumption
                          ? selected.car.fuel_consumption
                          : "--"}
                        <small> L/100km</small>
                      </span>
                    </div>
                  </div>
                  <div className="buttons-group">
                    <button className="hud-btn back" onClick={closeDetail}>
                      ATRÁS
                    </button>

                    {/* CONDICIONAL: ¿Está aceptada la tarea? */}
                    {!isTaskAccepted ? (
                      <>
                        <button
                          className="hud-btn reject"
                          onClick={handleRejectTask}
                          disabled={selected.estado === "completado"}
                        >
                          RECHAZAR
                        </button>
                        <button
                          className="hud-btn accept"
                          onClick={handleAcceptTask}
                          disabled={selected.estado === "completado"}
                        >
                          CONFIRMAR TAREA
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Botón de Diagnóstico solo si está "en proceso" */}
                        {selected.estado === "en proceso" && (
                          <button
                            className="hud-btn diag"
                            onClick={runDiagnostics}
                          >
                            DIAGNÓSTICO
                          </button>
                        )}
                        {/* Botón de Finalizar/Completar Tarea */}
                        <button
                          className="hud-btn accept"
                          // Llama a la nueva función asíncrona handleCompleteTask
                          onClick={handleCompleteTask}
                          disabled={selected.estado === "completado"}
                        >
                          {selected.estado === "completado"
                            ? "FINALIZADO"
                            : "COMPLETAR TAREA"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ✨ PANEL DE DIAGNÓSTICO (Slider desde la derecha) */}
          {selected && isTaskAccepted && (
            <div
              className={`diagnostics-panel ${isDiagnosticsOpen ? "open" : ""}`}
            >
              <div className="dp-header">
                <h2>DIAGNÓSTICO TÉCNICO</h2>
                <button
                  className="hud-btn close-diag"
                  onClick={toggleDiagnostics}
                >
                  CERRAR [X]
                </button>
              </div>

              <div className="dp-body">
                <h3>🔎 Datos del Vehículo ({selected.car?.patente})</h3>
                {/* ... Detalles del vehículo ... */}
                <p className="detail-info">
                  **Motor:** {selected.car?.power || "--"} HP / **Transmisión:**{" "}
                  {selected.car?.transmission || "--"}
                </p>
                <p className="detail-info">
                  **Consumo:** {selected.car?.fuel_consumption || "--"} L/100km
                  / **Autonomía:** {selected.car?.fuel_capacity || "--"} L
                </p>
                <p className="detail-info">
                  **Kms:** {selected.car?.mileage || "--"} / **Próximo
                  Service:** {selected.car?.service_interval || "--"} Kms
                </p>

                <hr className="dp-divider" />

                <h3>📝 Notas de Diagnóstico (Editable)</h3>

                <div className="diagnostics-section">
                  {/* 1. Observación Inicial */}
                  <h4>1. Prueba de Manejo & Reporte Cliente</h4>
                  <div
                    className="diagnostic-input-box"
                    tabIndex={0}
                    onFocus={(e) => e.currentTarget.classList.add("focused")}
                    onBlur={(e) => e.currentTarget.classList.remove("focused")}
                  >
                    <FaCarCrash size={20} className="diagnostic-icon" />
                    <textarea
                      name="initialObservation"
                      value={diagnosticNotes.initialObservation}
                      onChange={handleNoteChange}
                      placeholder={`El cliente reporta: "${selected.turno?.descripcion}". Escribe tus observaciones iniciales aquí...`}
                      rows="3"
                      className="diagnostic-input"
                    ></textarea>
                  </div>

                  {/* 2. Resultados del Escáner */}
                  <h4>2. Resultados del Escáner/Inspección</h4>
                  <div
                    className="diagnostic-input-box"
                    tabIndex={0}
                    onFocus={(e) => e.currentTarget.classList.add("focused")}
                    onBlur={(e) => e.currentTarget.classList.remove("focused")}
                  >
                    <FaWrench size={20} className="diagnostic-icon" />
                    <textarea
                      name="scannerResults"
                      value={diagnosticNotes.scannerResults}
                      onChange={handleNoteChange}
                      placeholder="Códigos de error, mediciones, fallas encontradas..."
                      rows="3"
                      className="diagnostic-input"
                    ></textarea>
                  </div>

                  {/* 3. Acciones Recomendadas */}
                  <h4>3. Acciones Recomendadas y Repuestos Necesarios</h4>
                  <div
                    className="diagnostic-input-box"
                    tabIndex={0}
                    onFocus={(e) => e.currentTarget.classList.add("focused")}
                    onBlur={(e) => e.currentTarget.classList.remove("focused")}
                  >
                    <FaTools size={20} className="diagnostic-icon" />
                    <textarea
                      name="recommendedActions"
                      value={diagnosticNotes.recommendedActions}
                      onChange={handleNoteChange}
                      placeholder="Lista de reparaciones a realizar y repuestos a solicitar..."
                      rows="3"
                      className="diagnostic-input"
                    ></textarea>
                  </div>
                </div>

                <button
                  className="hud-btn save-diag"
                  onClick={handleSaveDiagnostics} // Llama a la nueva función de guardar
                >
                  GUARDAR DIAGNÓSTICO
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VehicleRepairs;
