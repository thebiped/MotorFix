import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, CheckCircle, TrendingUp, ToolCase } from "lucide-react";
import "./DashboardMecanico.css";

/**
 * DashboardMecanico.jsx
 * - Mantiene el estilo del Admin
 * - Dashboard simplificado y funcional
 */

const barData = [
  { name: "Aceite", value: 24 },
  { name: "Frenos", value: 42 },
  { name: "Diag", value: 35 },
  { name: "Batería", value: 28 },
  { name: "Suspensión", value: 45 },
  { name: "Otros", value: 60 },
];

const pieData = [
  { name: "Completados", value: 98 },
  { name: "Satisfacción", value: 50 },
  { name: "Utilización", value: 75 },
];

const recent = [
  {
    id: 1,
    title: "Servicio completado",
    sub: "Ford Focus — Cambio de aceite",
    icon: <CheckCircle />,
  },
  {
    id: 2,
    title: "Nuevo trabajo",
    sub: "Toyota Corolla — Diagnóstico motor",
    icon: <ToolCase />,
  },
  {
    id: 3,
    title: "Turno agendado",
    sub: "Volkswagen Gol — 14:00",
    icon: <Calendar />,
  },
];

const topJobs = [
  { id: 1, title: "Diagnóstico completo - Motor Diesel", date: "04/11", price: 850 },
  { id: 2, title: "Cambio de transmisión - Toyota", date: "03/11", price: 720 },
  { id: 3, title: "Sistema eléctrico - VW", date: "02/11", price: 650 },
];

const DashboardMecanico = () => {
  const COLORS = useMemo(() => ["#ff4b4b", "#222", "#c70b0b"], []);

  const stats = {
    ingresos: "$12.300",
    enReparacion: 12,
    reparadosHoy: 5,
    calif: 4.8,
  };

  return (
    <div className="admin-dashboard modern dashboard-mecanico">
      <main className="adm-content">
        <section className="left-col">
          <div className="all-stats-grid">
            <div className="card stat-card">
              <p className="card-title">Ingresos del Mes</p>
              <h3 className="card-value">{stats.ingresos}</h3>
            </div>
            <div className="card stat-card">
              <p className="card-title">Autos en reparación</p>
              <h3 className="card-value">{stats.enReparacion}</h3>
            </div>
            <div className="card stat-card">
              <p className="card-title">Reparados hoy</p>
              <h3 className="card-value">{stats.reparadosHoy}</h3>
            </div>
            <div className="card stat-card">
              <p className="card-title">Calificación</p>
              <h3 className="card-value">{stats.calif}</h3>
            </div>
          </div>

          <div className="progress-block">
            <div className="progress-header">
              <h4>Progreso de Servicios</h4>
              <div className="graph-controls">
                <button className="time-btn active">Semana</button>
                <button className="time-btn">Mes</button>
                <button className="date-picker">
                  <TrendingUp /> <span style={{ marginLeft: 6 }}>Hoy</span>
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 6, right: 4, left: 0, bottom: 6 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text)", fontSize: 12 }}
                />
                <ToolCase />
                <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                  {barData.map((entry, idx) => (
                    <Cell
                      key={`c-${idx}`}
                      fill={`rgba(255,75,75,${0.6 + idx * 0.04})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="right-col">
          <div className="recent-panel">
            <h4 className="panel-title">Actividad Reciente</h4>
            <div className="activity-list">
              {recent.map((r) => (
                <div key={r.id} className="activity-item">
                  <div className="act-icon">{r.icon}</div>
                  <div className="act-content">
                    <div className="act-title">{r.title}</div>
                    <div className="act-sub">{r.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pie-panel" style={{ marginTop: 16 }}>
            <h4 className="panel-title" style={{ marginBottom: 12 }}>
              Eficiencia del Taller
            </h4>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={450}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="recent-panel" style={{ marginTop: 16 }}>
            <h4 className="panel-title">Mejores Trabajos</h4>
            <div className="activity-list" style={{ marginTop: 8 }}>
              {topJobs.map((j) => (
                <div key={j.id} className="activity-item" style={{ justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="act-icon">
                      <ToolCase />
                    </div>
                    <div>
                      <div className="act-title">{j.title}</div>
                      <div className="act-sub">{j.date}</div>
                    </div>
                  </div>
                  <div style={{ color: "var(--accent)", fontWeight: 700 }}>{`$${j.price}`}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardMecanico;
