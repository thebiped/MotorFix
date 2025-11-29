import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import "./VehicleRepairs.css";

const PLACEHOLDER_CAR =
  "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect fill='%23000' width='100%25' height='100%25'/><text x='50%25' y='50%25' font-size='18' fill='%23fff' alignment-baseline='middle' text-anchor='middle'>NO IMAGE</text></svg>";

const VehicleRepairs = () => {
  const { mecanicoId } = useOutletContext();
  const [repairs, setRepairs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado local para determinar si la tarea SELECCIONADA está aceptada
  const [isTaskAccepted, setIsTaskAccepted] = useState(false);

  // ===================================
  // 1. LÓGICA DE OBTENCIÓN DE DATOS (Fetch Real)
  // ===================================
  const fetchRepairs = async () => {
    if (!mecanicoId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/turnos/mecanico/${mecanicoId}`
      );
      // El backend devuelve una estructura diferente (mira routes/turnos.js),
      // pero el array 'data' se asigna directamente a 'repairs'.
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
      // Opcional: mostrar un mensaje de error en la UI
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, [mecanicoId]);

  // ===================================
  // 2. LÓGICA DE SELECCIÓN
  // ===================================
  const selectRepair = (repair) => {
    // Usamos 'id' en lugar de 'id_turno' para el fetch real
    setSelected(repair);
    // Asumimos que "en proceso" significa aceptada. Si quieres usar otro campo, cámbialo aquí.
    setIsTaskAccepted(repair.estado === "en proceso");
  };

  const closeDetail = () => setSelected(null);

  const runDiagnostics = () => alert("Iniciando escaneo de diagnóstico...");

  // ===================================
  // 3. LÓGICA DE BOTONES (Aceptar/Rechazar)
  // ===================================

  const handleAcceptTask = async () => {
    if (!selected) return;

    try {
      // Usamos selected.id ya que el fetch real lo mapea así
      await axios.put(
        `http://localhost:3001/api/turnos/asignar/${selected.id}`,
        {
          mecanico_id: mecanicoId,
          estado: "en proceso",
        }
      );

      // 2. Lógica de ÉXITO (Actualización de UI)
      setIsTaskAccepted(true);
      // Actualizamos el estado del item en la lista y el seleccionado
      const updatedRepair = { ...selected, estado: "en proceso" };
      setSelected(updatedRepair);

      setRepairs((prev) =>
        prev.map((r) => (r.id === selected.id ? updatedRepair : r))
      );

      alert(`✅ Tarea ${selected.id} CONFIRMADA. Estado: EN PROGRESO.`);
    } catch (error) {
      console.error(
        "Error al confirmar la tarea:",
        error.response?.data || error.message
      );
      alert("❌ Error al confirmar la tarea. Intente nuevamente.");
    }
  };

  const handleRejectTask = async () => {
    if (!selected) return;

    const confirmReject = window.confirm(
      "¿Estás seguro de rechazar esta asignación? Será devuelta al administrador."
    );

    if (confirmReject) {
      try {
        // 1. Llamada al backend para RECHAZAR (desasignar)
        await axios.put(
          `http://localhost:3001/api/turnos/asignar/${selected.id}`,
          {
            mecanico_id: null,
            estado: "pendiente",
          }
        );

        // 2. Lógica de ÉXITO (Actualización de UI)
        // Removemos visualmente el turno de la lista.
        setRepairs(repairs.filter((r) => r.id !== selected.id));
        setSelected(null); // Cierra el detalle

        alert("❌ Asignación rechazada y devuelta al pool de pendientes.");
      } catch (error) {
        console.error(
          "Error al rechazar el turno:",
          error.response?.data || error.message
        );
        alert(
          "❌ Error al comunicar con el sistema central. Intente nuevamente."
        );
      }
    }
  };

  // ===================================
  // 4. RENDERIZADO (Usando la estructura de la versión 2 para la lista, y de la versión 1 para los botones)
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
                <h2 className="panel-title">REPARACIONES ASIGNADAS</h2>
                <div className="repair-list-scroll">
                  {repairs.length === 0 && (
                    <p className="empty-list-message">
                      No hay turnos asignados a tu ID de mecánico.
                    </p>
                  )}
                  {repairs.map((r) => (
                    <div
                      key={r.id} // Usamos 'id' del fetch real
                      className={`repair-block ${
                        selected?.id === r.id ? "selected-block" : ""
                      }`}
                      onClick={() => selectRepair(r)}
                    >
                      <div className="block-header">
                        {/* Usamos 'user' del fetch real, no 'cliente' */}
                        <span className="client-name">
                          {r.user?.name || "Cliente Desconocido"}
                        </span>
                        <span
                          className={`priority-badge ${r.prioridad.toLowerCase()}`}
                        >
                          {r.prioridad}
                        </span>
                      </div>
                      <div className="block-body">
                        <p className="problem-text">
                          {r.turno.descripcion?.toUpperCase()}
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
                    {/* ✨ Cambio 1: Usar la image_url del backend */}
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
                    {/* Indicador de estado visual en el detalle */}
                    <div className="detail-row">
                      <span className="label">Estado Actual:</span>
                      <span
                        className={`value ${
                          !isTaskAccepted ? "status-pending" : "status-active"
                        }`}
                      >
                        {isTaskAccepted
                          ? "EN PROGRESO"
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
                  {/* ✨ Cambio 2: Mostrar las estadísticas del vehículo */}
                  <div className="stats-group">
                    {/* Estadísticas principales */}
                    <div className="stat-box">
                      <span className="stat-label">Velocidad Máx.</span>
                      <span className="stat-num">
                        {selected.car?.top_speed
                          ? selected.car.top_speed
                          : "--"}
                        <small> km/h</small>
                      </span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Aceleración</span>
                      <span className="stat-num">
                        {selected.car?.acceleration
                          ? selected.car.acceleration
                          : "--"}
                        <small> seg</small>
                      </span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Manejo</span>
                      <span className="stat-num">
                        {selected.car?.handling ? selected.car.handling : "--"}
                        <small> /100</small>
                      </span>
                    </div>
                  </div>
                  <div className="buttons-group">
                    <button className="hud-btn back" onClick={closeDetail}>
                      ATRÁS
                    </button>

                    {/* CONDICIONAL: ¿Está aceptada la tarea? */}
                    {/* Usamos isTaskAccepted para determinar qué botones mostrar */}
                    {!isTaskAccepted ? (
                      <>
                        <button
                          className="hud-btn reject"
                          onClick={handleRejectTask}
                        >
                          RECHAZAR
                        </button>
                        <button
                          className="hud-btn accept"
                          onClick={handleAcceptTask}
                        >
                          CONFIRMAR TAREA
                        </button>
                      </>
                    ) : (
                      <button className="hud-btn diag" onClick={runDiagnostics}>
                        DIAGNÓSTICO
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VehicleRepairs;
