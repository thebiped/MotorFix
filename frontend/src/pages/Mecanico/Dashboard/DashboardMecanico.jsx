import React, { useMemo } from "react";
import {
  Wrench,
  Star,
  Car,
  ArrowUpRight,
  CheckCircle,
  Calendar,
  ToolCase,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./DashboardMecanico.css";

// Datos de ejemplo - En un caso real estos vendrían de una API
const statsData = {
  ganancias: 12300,
  autosReparacion: 12,
  autosReparadosHoy: 5,
  turnosPendientes: 8,
  calificacion: 4.8,
};

const barData = [
  { name: "Cambio de aceite", value: 24 },
  { name: "Frenos", value: 42 },
  { name: "Diagnóstico", value: 35 },
  { name: "Baterías", value: 28 },
  { name: "Suspensión", value: 45 },
  { name: "Otros", value: 60 },
];

const pieData = [
  { name: "Servicios completados", value: 98 },
  { name: "Satisfacción cliente", value: 50 },
  { name: "Utilización mecánicos", value: 75 },
];

const mejoresTrabajos = [
  { id: 1, nombre: "Motor Diesel - Diagnóstico completo", fecha: "04/11", precio: 850 },
  { id: 2, nombre: "Cambio de transmisión - Toyota", fecha: "04/08/23", precio: 720 },
  { id: 3, nombre: "Sistema eléctrico - Volkswagen", fecha: "04/08/23", precio: 650 },
];

const actividadReciente = [
  { tipo: "completado", descripcion: "Servicio Completado", detalle: "Cambio de aceite • Ford Focus", tiempo: "Hace 2 horas" },
  { tipo: "nuevo", descripcion: "Nuevo trabajo asignado", detalle: "Revisión de motor • Toyota Camry", tiempo: "Hace 2 horas" },
  { tipo: "turno", descripcion: "Turno Próximo", detalle: "Volkswagen UP • cita de horas a las 14:00", tiempo: "Hace 2 horas" },
];

// Tooltip personalizado para Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p>{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const DashboardMecanico = () => {
  const COLORS = useMemo(() => ["#ff0000", "#4CAF50", "#2196F3"], []);

  return (
    <div className="dashboard-container">

      {/* --- MÉTRICAS --- */}
      <div className="stats-card ganancias-card">
        <div className="stats-header">
          <h3>Ganancias del Mes</h3>
          <ToolCase color="white" size={20} />
        </div>
        <div className="stats-value">{`$${statsData.ganancias.toLocaleString()}`}</div>
        <div className="stats-trend">+15% vs mes anterior</div>
      </div>

      <div className="stats-card">
        <div className="stats-header">
          <h3>Autos en reparación</h3>
          <Car color="white" size={20} />
        </div>
        <div className="stats-value">{statsData.autosReparacion}</div>
      </div>

      <div className="stats-card">
        <div className="stats-header">
          <h3>Autos reparados hoy</h3>
          <Wrench color="white" size={20} />
        </div>
        <div className="stats-value">{statsData.autosReparadosHoy}</div>
      </div>

      <div className="stats-card">
        <div className="stats-header">
          <h3>Calificación promedio</h3>
          <Star color="white" size={20} />
        </div>
        <div className="stats-value">{statsData.calificacion}</div>
      </div>

      {/* --- BARRA (Progreso de servicios) --- */}
      <div className="chart-container">
        <div className="chart-title">
          <h3>Progreso de Servicios Realizados</h3>
          <ArrowUpRight color="white" size={20} />
        </div>
        <div className="bar-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#ddd' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ddd' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8,8,8,8]} maxBarSize={48}>
                {barData.map((entry, idx) => (
                  <Cell key={`bar-${idx}`} fill={`rgba(255,40,40,${0.6 + idx * 0.05})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Mejores Trabajos --- */}
      <div className="top-jobs">
        <div className="chart-title">
          <h3>Mejores Trabajos</h3>
          <ArrowUpRight color="white" size={18} />
        </div>
        {mejoresTrabajos.map((t) => (
          <div key={t.id} className="job-item">
            <div className="job-info">
              <div className="job-number">{t.id}</div>
              <div className="job-details">
                <h4>{t.nombre}</h4>
                <p>{t.fecha}</p>
              </div>
            </div>
            <div className="job-price">{`$${t.precio}`}</div>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <div className="chart-title">
          <h3>Eficiencia del Taller</h3>
          <ArrowUpRight color="white" size={18} />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
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
      {/* --- Actividad Reciente --- */}
      <div className="recent-activity">
        <div className="chart-title">
          <h3>Actividad Reciente</h3>
        </div>
        {actividadReciente.map((a, i) => (
          <div key={i} className="activity-item">
            <div className="activity-icon">
              {a.tipo === "completado" && <CheckCircle />}
              {a.tipo === "nuevo" && <ToolCase />}
              {a.tipo === "turno" && <Calendar />}
            </div>
            <div className="activity-details">
              <h4>{a.descripcion}</h4>
              <p>{a.detalle}</p>
              <p>{a.tiempo}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- Pie (Eficiencia) --- */}
    </div>
  );
};

export default DashboardMecanico;
