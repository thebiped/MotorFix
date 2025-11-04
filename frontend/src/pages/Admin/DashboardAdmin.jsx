import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaCalendarAlt, FaTools, FaUserCircle } from "react-icons/fa";
import "./DashboardAdmin.css";

const barData = [
  { name: "Semana 1", value: 12000 },
  { name: "Semana 2", value: 48000 },
  { name: "Semana 3", value: 30000 },
  { name: "Semana 4", value: 20000 },
  { name: "Semana 5", value: 45000 },
  { name: "Semana 6", value: 60000 },
];

const pieData = [
  { name: "Servicios completados", value: 98 },
  { name: "Satisfacción cliente", value: 50 },
  { name: "Utilización mecánicos", value: 75 },
];

const COLORS = ["#ff4b4b", "#222", "#c70b0b"];

const recentActivities = [
  { id: 1, title: "Servicio Completado", subtitle: "Ford Focus", icon: <FaTools /> },
  { id: 2, title: "Nuevo cliente", subtitle: "Maria López - Toyota Corolla", icon: <FaUserCircle /> },
  { id: 3, title: "Turno Agendado", subtitle: "Volkswagen Gol", icon: <FaCalendarAlt /> },
];

const DashboardAdmin = () => {
  return (
    <div className="admin-dashboard modern">
      {/* TOPBAR */}
      <header className="adm-topbar">
        <h2>Dashboard</h2>
      </header>

      <main className="adm-content">
        {/* COLUMNA IZQUIERDA */}
        <section className="left-col">
          {/* ESTADÍSTICAS PRINCIPALES */}
          <div className="all-stats-grid modern">
            {[
              { title: "Ingresos del Mes", value: "$67.000" },
              { title: "Servicios Activos", value: "47" },
              { title: "Servicios Acabados", value: "35" },
              { title: "Turnos Pendientes", value: "12" },
            ].map((stat, idx) => (
              <div key={idx} className="card modern stat-card">
                <p className="card-title">{stat.title}</p>
                <h3 className="card-value">{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* BLOQUE DE PROGRESO DE SERVICIOS */}
          <div className="progress-block modern">
            <div className="progress-header">
              <h4>Progreso de Servicios</h4>
              <div className="graph-controls">
                {["Día", "Semana", "Mes", "Año"].map((label, idx) => (
                  <button key={idx} className={`time-btn ${idx === 0 ? "active" : ""}`}>{label}</button>
                ))}
                <button className="date-picker">
                  <FaCalendarAlt /> <span>14 Oct 2025</span>
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                  {barData.map((entry, idx) => (
                    <Cell key={idx} fill={`rgba(255,75,75,${0.6 + idx * 0.05})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* COLUMNA DERECHA */}
        <aside className="right-col">
          {/* PIE CHART DE EFICIENCIA */}
          <div className="pie-panel modern">
            <h4 className="panel-title">Eficiencia del Taller</h4>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* ACTIVIDAD RECIENTE */}
          <div className="recent-panel modern">
            <h4 className="panel-title">Actividad Reciente</h4>
            <div className="activity-list">
              {recentActivities.map((act) => (
                <div key={act.id} className="activity-item modern">
                  <div className="act-icon">{act.icon}</div>
                  <div className="act-content">
                    <div className="act-title">{act.title}</div>
                    <div className="act-sub">{act.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default DashboardAdmin;
