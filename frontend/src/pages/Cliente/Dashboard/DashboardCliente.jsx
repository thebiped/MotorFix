import React, { useMemo } from "react";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  CheckCircle,
  Wrench,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./DashboardCliente.css";

const stats = {
  gastoTotal: 45200,
  misAutos: 3,
  serviciosRealizados: 8,
  turnosActivos: 12,
};

const barData = [
  { name: "Cambio de aceite", value: 24 },
  { name: "Frenos", value: 42 },
  { name: "Diagnóstico", value: 32 },
  { name: "Baterías", value: 28 },
  { name: "Suspensión", value: 45 },
  { name: "Otros", value: 52 },
];

const proximasCitas = new Array(6).fill(0).map((_, i) => ({
  id: i + 1,
  title: "Cambio de aceite y filtros",
  car: "Ford Focus 2020",
  datetime: "19/03/2024 a las 09:00",
  person: "Usuario M",
}));

const actividadReciente = [
  {
    tipo: "completado",
    titulo: "Servicio Completado",
    detalle: "Cambio de aceite • Ford Focus",
    tiempo: "Hace 2 horas",
  },
  {
    tipo: "nuevo",
    titulo: "Nuevo trabajo asignado",
    detalle: "Revisión de motor • Toyota Camry",
    tiempo: "Hace 8 horas",
  },
  {
    tipo: "turno",
    titulo: "Turno Próximo",
    detalle: "Volkswagen Gold • Cambio de frenos a las 14:00",
    tiempo: "Hace 1 día",
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">{`${label}: ${payload[0].value}`}</div>
    );
  }
  return null;
};

const DashboardCliente = () => {
  const COLORS = useMemo(() => ["#ff3b3b", "#ff6b6b", "#ff8b8b"], []);

  return (
    <div className="dashboard-cliente-container">
      <div className="left-grid">
        <div className="big-card gasto-card">
          <div className="card-header">
            <h3>Gasto Total Este Año</h3>
          </div>
          <div className="gasto-value">{`$${stats.gastoTotal.toLocaleString()}`}</div>
          <div className="gasto-sub">+15% vs mes anterior</div>
        </div>

        <div className="mini-card">
          <h4>Mis Autos</h4>
          <div className="mini-value">{stats.misAutos}</div>
        </div>

        <div className="mini-card">
          <h4>Servicios Realizados</h4>
          <div className="mini-value">{stats.serviciosRealizados}</div>
        </div>

        <div className="mini-card">
          <h4>Turnos Activos</h4>
          <div className="mini-value">{stats.turnosActivos}</div>
        </div>

        <div className="chart-block">
          <div className="chart-title">
            <h3>Progreso de Servicios Realizados</h3>
            <ArrowUpRight color="white" size={18} />
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#ddd" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#ddd" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                  {barData.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={`rgba(255,40,40,${0.6 + idx * 0.05})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="recent-activity cliente-activity">
          <h3>Actividad Reciente</h3>
          {actividadReciente.map((a, i) => (
            <div className="activity-item" key={i}>
              <div className="activity-icon">
                {a.tipo === "completado" && <CheckCircle />}
                {a.tipo === "nuevo" && <Wrench />}
                {a.tipo === "turno" && <Clock />}
              </div>
              <div className="activity-details">
                <h4>{a.titulo}</h4>
                <p className="muted">{a.detalle}</p>
                <p className="muted small">{a.tiempo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="right-column">
        <div className="upcoming-card">
          <h3>Próximas Citas</h3>
          <div className="appointments">
            {proximasCitas.map((c) => (
              <div key={c.id} className="appointment-item">
                <div className="badge">1</div>
                <div className="appointment-info">
                  <strong>{c.title}</strong>
                  <p className="muted">{c.car}</p>
                  <p className="muted small">{`${c.datetime} • ${c.person}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DashboardCliente;
