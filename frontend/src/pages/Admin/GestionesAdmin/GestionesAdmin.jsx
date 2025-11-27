// src/components/GestionesAdmin/GestionesAdmin.jsx
import React, { useState, useMemo } from "react";
import {
  FaPlus,
  FaCalendarAlt,
  FaTools,
  FaUserCircle,
  FaClipboardList,
  FaSearch,
  FaChevronLeft, // Para el calendario
  FaChevronRight, // Para el calendario
} from "react-icons/fa";
import ClientesTable from "./ClientesTable";
import TurnosTable from "./TurnosTable";
import "./GestionesAdmin.css";

const GestionesAdmin = () => {
  const [activeTab, setActiveTab] = useState("clientes");

  // --- filtros globales que se pasan a las tablas ---
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // e.g. "Activo", "Pendiente", "Completado"
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // calendario
  const [monthOffset, setMonthOffset] = useState(0);
  const currentDate = new Date();
  const currentMonth = useMemo(() => {
    const d = new Date();
    d.setMonth(currentDate.getMonth() + monthOffset);
    // Para el formato de calendario
    return d.toLocaleString("es-ES", { month: "long", year: "numeric" }); 
  }, [monthOffset, currentDate]);
  
  // Función placeholder para generar un calendario simple (solo para estilos)
  const renderCalendarDays = () => {
    const today = new Date().getDate();
    const daysInMonth = 30; // Simplificado
    let days = [];
    // Días de ejemplo para renderizar y probar estilos
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(
            <div 
                key={i} 
                className={`calendar-date current-month ${i === today ? 'highlight' : ''}`}
            >
                {i}
            </div>
        );
    }
    return days;
  };


  // estadísticas (placeholder)
  const stats = [
    { title: "Turnos programados", value: "En espera: 52" },
    { title: "Vehículo registrados", value: "Vehículos: 20" },
    { title: "Repuestos en stock", value: "Stock: 43" },
    { title: "Clientes activos", value: "Activos: 8" },
  ];

  // recent activities (placeholder)

  const renderActiveTable = () => {
    const filterProps = { search, statusFilter, dateFrom, dateTo };
    switch (activeTab) {
      case "clientes":
        return <ClientesTable filters={filterProps} />;
      case "turnos":
        return <TurnosTable filters={filterProps} />;
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
        {/* COLUMNA IZQUIERDA: TABLAS */}
        <div className="tables-section">
          {/* Tabs y Acciones */}
          <div className="tabs">
            <div className="tab-group">
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

      </main>
    </div>
  );
};

export default GestionesAdmin;