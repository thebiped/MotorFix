// src/components/GestionesAdmin/GestionesAdmin.jsx
import React, { useState, useMemo } from "react";
import {
  FaPlus,
  FaCalendarAlt,
  FaTools,
  FaUserCircle,
  FaClipboardList,
  FaSearch,
} from "react-icons/fa";
import ClientesTable from "./ClientesTable";
import TurnosTable from "./TurnosTable";
import RepuestosTable from "./RepuestosTable";
import "./GestionesAdmin.css";

const GestionesAdmin = () => {
  const [activeTab, setActiveTab] = useState("clientes");

  // --- filtros globales que se pasan a las tablas ---
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // e.g. "Activo", "Pendiente", "Completado"
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // calendario (mes simple, no dependencia externa)
  const [monthOffset, setMonthOffset] = useState(0);
  const currentMonth = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    return d.toLocaleString("es-ES", { month: "long", year: "numeric" });
  }, [monthOffset]);

  // estadísticas (placeholder)
  const stats = [
    { title: "Clientes activos", value: "154" },
    { title: "Turnos del día", value: "12" },
    { title: "Repuestos en stock", value: "43" },
    { title: "Servicios pendientes", value: "8" },
  ];

  // recent activities (placeholder)
  const recentActivities = [
    {
      id: 1,
      title: "Nuevo Cliente",
      desc: "María López registrada",
      icon: <FaUserCircle />,
    },
    {
      id: 2,
      title: "Turno confirmado",
      desc: "Ford Focus - 10:30 AM",
      icon: <FaCalendarAlt />,
    },
    {
      id: 3,
      title: "Repuesto agregado",
      desc: "Batería Bosch 12V",
      icon: <FaTools />,
    },
  ];

  const renderActiveTable = () => {
    const filterProps = { search, statusFilter, dateFrom, dateTo };
    switch (activeTab) {
      case "clientes":
        return <ClientesTable filters={filterProps} />;
      case "turnos":
        return <TurnosTable filters={filterProps} />;
      case "repuestos":
        return <RepuestosTable filters={filterProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="gestiones-admin modern">
      <header className="gestiones-header">
        <h2>Gestión Administrativa</h2>
      </header>

      {/* Estadísticas */}
      <section className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <p className="stat-title">{s.title}</p>
            <h3 className="stat-value">{s.value}</h3>
          </div>
        ))}
      </section>

      {/* Main layout: left (tables) - right (calendar + filter + recent) */}
      <main className="gestiones-main">
        <div className="tables-section">
          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === "clientes" ? "active" : ""}`}
              onClick={() => setActiveTab("clientes")}
            >
              <FaUserCircle /> Clientes
            </button>
            <button
              className={`tab-btn ${activeTab === "turnos" ? "active" : ""}`}
              onClick={() => setActiveTab("turnos")}
            >
              <FaClipboardList /> Turnos
            </button>
            <button
              className={`tab-btn ${activeTab === "repuestos" ? "active" : ""}`}
              onClick={() => setActiveTab("repuestos")}
            >
              <FaTools /> Repuestos
            </button>
          </div>

          {/* Actions + search (global) */}
          <div className="table-actions">
            <div className="left-actions">
              <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                  className="global-search"
                  placeholder="Buscar (nombre, detalle, patente...)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="right-actions">
              <button className="action-btn export-btn">Exportar CSV</button>
              <button className="action-btn add-btn">
                <FaPlus /> Nuevo
              </button>
            </div>
          </div>

          {/* Table container (max height control) */}
          <div className="table-container">{renderActiveTable()}</div>
        </div>

        <aside className="right-sidebar">
          {/* Calendario */}
          <div className="calendar-card">
            <div className="calendar-header">
              <button
                className="nav-btn"
                onClick={() => setMonthOffset((m) => m - 1)}
              >
                ‹
              </button>
              <h3>{currentMonth}</h3>
              <button
                className="nav-btn"
                onClick={() => setMonthOffset((m) => m + 1)}
              >
                ›
              </button>
            </div>

            <div className="calendar-grid">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
                <div key={d} className="day-name">
                  {d}
                </div>
              ))}
              {[...Array(31).keys()].map((i) => (
                <div
                  key={i}
                  className={`day ${
                    i + 1 === new Date().getDate() && monthOffset === 0
                      ? "active-day"
                      : ""
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Filtros */}
          <div className="filter-card">
            <h3>Filtros</h3>

            <label>Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Completado">Completado</option>
              <option value="Confirmado">Confirmado</option>
            </select>

            <label>Desde</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />

            <label>Hasta</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />

            <div className="filter-actions">
              <button
                className="filter-btn apply-btn"
                onClick={() => {
                  /* aplica filtros ya manejados por estado */
                }}
              >
                Aplicar
              </button>
              <button
                className="filter-btn clear-btn"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                  setDateFrom("");
                  setDateTo("");
                }}
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Actividades recientes */}
          <div className="recent-card">
            <h3>Actividades Recientes</h3>
            <ul className="activity-list">
              {recentActivities.map((a) => (
                <li key={a.id} className="activity-item">
                  <div className="icon">{a.icon}</div>
                  <div>
                    <p className="activity-title">{a.title}</p>
                    <span className="activity-desc">{a.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default GestionesAdmin;
