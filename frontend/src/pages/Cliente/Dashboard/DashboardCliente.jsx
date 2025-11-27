// DashboardCliente.jsx (versión modificada para clientes)
// Basado en DashboardAdmin pero adaptado para vista del cliente

import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { FaCalendarAlt, FaTools, FaUserCircle } from "react-icons/fa";
import "./DashboardCliente.css";

// ==========================
// 🎛️ CIRCULAR HUD — ANIMADO
// ==========================

const CircularHUD = ({ size = 120, stroke = 8, value = 75, label = "Estado" }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (value / 100);
  const gap = circumference - dash;

  const [animatedValue, setAnimatedValue] = useState(0);
  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();

    function animate(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);

      setAnimatedValue(Math.round(progress * value));
      setDashOffset(circumference - progress * dash);

      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [value, dash, circumference]);

  return (
    <div className="circular-hud" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="circle-anim">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--neon-2)" />
            <stop offset="100%" stopColor="var(--neon)" />
          </linearGradient>
        </defs>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={stroke} />
          <circle
            r={radius}
            fill="none"
            stroke="url(#g1)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={dashOffset}
            transform="rotate(-90)"
          />
        </g>
      </svg>
      <div className="circular-label fadeInDelayed">
        <div className="circular-value">{animatedValue}%</div>
        <div className="circular-text">{label}</div>
      </div>
    </div>
  );
};

// ==========================
// CLIENT-SPECIFIC DATA
// ==========================

const stats = [
  { id: 1, label: "Próximo turno", value: "15 Feb" },
  { id: 2, label: "Servicios en curso", value: "2" },
  { id: 3, label: "Historial total", value: "14 servicios" },
  { id: 4, label: "Avisos pendientes", value: "1" },
];

const hudIndicators = [
  { id: 1, label: "Estado general del vehículo", value: 82 },
  { id: 2, label: "Mantenimiento actualizado", value: 67 },
  { id: 3, label: "Confianza del sistema", value: 92 },
];

const recentActivities = [
  { id: 1, icon: <FaTools />, title: "Diagnóstico completado", sub: "Motor y electrónica" },
  { id: 2, icon: <FaCalendarAlt />, title: "Turno confirmado", sub: "Cambio de aceite" },
  { id: 3, icon: <FaUserCircle />, title: "Actualización del perfil", sub: "Datos personales" },
];

// ==========================
// MAIN COMPONENT — CLIENTE
// ==========================

function DashboardCliente() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`hud-dashboard ${loaded ? "hud-loaded" : ""}`}>
      {/* LEFT */}
      <aside className="hud-left slideInLeft">
        <div className="hud-left-header fadeInFast">
          <div className="hud-title">TU VEHÍCULO</div>
          <div className="hud-subtitle">Resumen y estado</div>
        </div>

        {/* Stats */}
        <div className="hud-stats">
          {stats.map((s) => (
            <div className="hud-stat-card popIn" key={s.id}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Quicklist */}
        <div className="hud-quicklist fadeInSlow">
          <div className="ql-header">Actividades recientes</div>
          <div className="ql-list">
            <div className="ql-item hoverGlow">
              <div className="ql-pos">01</div>
              <div>
                <div className="ql-title">Cambio de aceite</div>
                <div className="ql-sub">Programado</div>
              </div>
              <div className="ql-tag">PRÓXIMO</div>
            </div>

            <div className="ql-item hoverGlow">
              <div className="ql-pos">02</div>
              <div>
                <div className="ql-title">Alineación y balanceo</div>
                <div className="ql-sub">Finalizado</div>
              </div>
              <div className="ql-tag done">OK</div>
            </div>
          </div>
        </div>
      </aside>

      {/* CENTER */}
      <main className="hud-center fadeIn">
        <div className="center-top">
          <div className="center-title">
            <h1>Panel del Cliente</h1>
            <div className="center-sub">Estado actual y próximas acciones</div>
          </div>
        </div>

        {/* PANEL */}
        <div className="hud-panel popIn">
          <div className="hud-grid-bg" />

          {/* Left Block */}
          <div className="hud-left-block">
            <div className="hud-block-title">Estado del vehículo</div>

            <div className="hud-indicators">
              {hudIndicators.map((ind) => (
                <div className="indicator-row slideInUp" key={ind.id}>
                  <div className="indicator-left">
                    <div className="indicator-label">{ind.label}</div>
                    <div className="indicator-sub">Actualizado</div>
                  </div>

                  <div className="indicator-gauge">
                    <div className="gauge-bar">
                      <div
                        className="gauge-fill"
                        style={{ width: ind.value + "%" }}
                      />
                    </div>
                    <div className="gauge-value">{ind.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Block */}
          <div className="hud-right-block">
            <div className="hud-circles">
              <CircularHUD value={84} label="Salud" />
              <CircularHUD value={63} label="Mantenimiento" />
              <CircularHUD value={92} label="Confiabilidad" />
            </div>
          </div>
        </div>
      </main>

      {/* RIGHT */}
      <aside className="hud-right slideInRight">
        <div className="right-title">Actividad reciente</div>
        <div className="right-sub">Últimos movimientos en tu cuenta</div>

        <div className="recent-list">
          {recentActivities.map((act) => (
            <div className="recent-row fadeInUpSmall" key={act.id}>
              <div className="recent-icon">{act.icon}</div>
              <div>
                <div className="recent-title">{act.title}</div>
                <div className="recent-sub">{act.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default DashboardCliente;
