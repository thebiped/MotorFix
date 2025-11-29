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

  // ... (Tus funciones fetchRepairs, selectRepair, etc. se mantienen igual)
  const fetchRepairs = async () => {
    if (!mecanicoId) return;
    setLoading(true);
    try {
      // Datos dummy para visualización
      const dummyData = [
        {
          id: 1, prioridad: "ALTA",
          cliente: { nombre: "Justin Mason" },
          turno: { descripcion: "RUIDO EN EL MOTOR", tipo_reparacion: "Mecánica", fecha: "2025-11-29T09:30:00.000Z" },
          car: { brand: "Audi", model: "Mustang GT", top_speed: "250", acceleration: "4.5", handling: "8.5", image: "https://i.imgur.com/uGzH2K4.png" },
          estado: "Pendiente"
        },
        {
          id: 2, prioridad: "Normal",
          cliente: { nombre: "Selina Kyle" },
          turno: { descripcion: "RUEDA DESALINEADA", tipo_reparacion: "Alineación", fecha: "2025-11-29T14:00:00.000Z" },
          car: { brand: "Ford", model: "Focus RS", top_speed: "260", acceleration: "5.0", handling: "8.0", image: "" },
          estado: "Pendiente"
        },
      ];
      setRepairs(dummyData);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => { fetchRepairs(); }, [mecanicoId]);
  const selectRepair = (repair) => setSelected(repair);
  const closeDetail = () => setSelected(null);
  const runDiagnostics = () => alert("Diagnóstico iniciado...");

  return (
    <div className="hud-container">
      {/* Loader Overlay */}
      {loading && (
        <div className="hud-loader-overlay">
          <div className="hud-loader-box">
            <div className="hud-loader-title">SYSTEM ACTIVATING...</div>
            <div className="hud-progress-bar"><div className="hud-progress-fill"></div></div>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* PANEL IZQUIERDO: LISTAS */}
          <div className="hud-panel left-panel">
            <div className="panel-decor top-left"></div>
            <div className="panel-decor bottom-left"></div>

            <div className="repair-lists-wrapper">
              {/* Sección Asignadas */}
              <div className="list-section">
                <h2 className="panel-title">REPARACIONES ASIGNADAS</h2>
                <div className="repair-list-scroll">
                  {repairs.map((r) => (
                    <div
                      key={r.id}
                      className={`repair-block ${selected?.id === r.id ? 'selected-block' : ''}`}
                      onClick={() => selectRepair(r)}
                    >
                      <div className="block-header">
                        <span className="client-name">{r.cliente?.nombre || "CLIENTE"}</span>
                        <span className={`priority-badge ${r.prioridad.toLowerCase()}`}>{r.prioridad}</span>
                      </div>
                      <div className="block-body">
                        <p className="problem-text">{r.turno.descripcion?.toUpperCase()}</p>
                        <p className="car-text">{r.car?.brand} {r.car?.model}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sección Completadas */}
              <div className="list-section completed-section">
                <h2 className="panel-title dimmed">REPARACIONES COMPLETADAS</h2>
                <div className="repair-list-scroll">
                  <div className="repair-block placeholder"><p>Historial vacío...</p></div>
                  <div className="repair-block placeholder"><p>Sin registros recientes</p></div>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL DERECHO: TABLET DETALLE */}
          <div className={`hud-panel right-panel ${selected ? 'active' : ''}`}>
            <div className="panel-decor top-right"></div>
            <div className="panel-decor bottom-right"></div>

            {!selected ? (
              <div className="empty-message">SELECCIONE UN TURNO PARA VER DETALLES</div>
            ) : (
              <div className="right-panel-content">
                
                {/* 1. HEADER: Marca y Modelo */}
                <div className="rp-header">
                  <div className="brand-tag">{selected.car?.brand}</div>
                  <h1 className="model-title">{selected.car?.model}</h1>
                </div>

                {/* 2. BODY: Imagen Central + Panel Detalles Flotante */}
                <div className="rp-body">
                  <div className="car-display-area">
                    <img src={selected.car?.image || PLACEHOLDER_CAR} alt="Car" className="main-car-img" />
                  </div>
                  
                  {/* Panel de detalles estilo 'Tarjeta' a la derecha */}
                  <div className="details-card">
                    <h3>DETALLES DEL TURNO</h3>
                    <div className="detail-row">
                      <span className="label">Problema:</span>
                      <span className="value">{selected.turno?.descripcion}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Tipo:</span>
                      <span className="value">{selected.turno?.tipo_reparacion}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Fecha:</span>
                      <span className="value">{new Date(selected.turno?.fecha).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Estado:</span>
                      <span className="value status-highlight">{selected.estado}</span>
                    </div>
                  </div>
                </div>

                {/* 3. FOOTER: Stats a la izquierda, Botones a la derecha */}
                <div className="rp-footer">
                  <div className="stats-group">
                    <div className="stat-box">
                      <span className="stat-label">Velocidad Top</span>
                      <span className="stat-num">{selected.car?.top_speed} <small>km/h</small></span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Aceleración</span>
                      <span className="stat-num">{selected.car?.acceleration} <small>s</small></span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-label">Manejo</span>
                      <span className="stat-num">{selected.car?.handling}</span>
                    </div>
                  </div>

                  <div className="buttons-group">
                    <button className="hud-btn back" onClick={closeDetail}>ATRÁS</button>
                    <button className="hud-btn diag" onClick={runDiagnostics}>DIAGNÓSTICO</button>
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