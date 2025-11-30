// src/components/GestionesAdmin/GestionesAdmin.jsx
import React, { useState, useMemo } from "react";
import {
  FaPlus,
  FaCalendarAlt,
  FaTools,
  FaUserCircle,
  FaClipboardList,
  FaSearch,
  FaChevronLeft, // NOTA: Estos iconos ya no son necesarios sin el calendario
  FaChevronRight, // pero los dejo por si los usas en otro lado.
} from "react-icons/fa";
import ClientesTable from "./ClientesTable";
import TurnosTable from "./TurnosTable";
import "./GestionesAdmin.css";
import api from "../../../services/api";

const GestionesAdmin = () => {
  const [activeTab, setActiveTab] = useState("clientes");

  // --- Estados para los Modales ---
  const [isAddClienteModalOpen, setIsAddClienteModalOpen] = useState(false);
  const [isAddTurnoModalOpen, setIsAddTurnoModalOpen] = useState(false);

  // --- Filtros globales (todavía usados por las tablas) ---
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // NOTA: Se eliminó el estado del calendario y las funciones asociadas.

  // --- FUNCIÓN DE AGREGAR TURNO ---
  const onAddTurno = (data) => {
    console.log("Turno a guardar:", data);
    setIsAddTurnoModalOpen(false);
    alert("Turno creado (simulado). Ahora TurnosTable debe recargar.");
  };

  // --- FUNCIÓN para manejar el click en "+ Nuevo" ---
  const handleNewClick = () => {
    if (activeTab === "clientes") {
      setIsAddClienteModalOpen(true);
    } else if (activeTab === "turnos") {
      setIsAddTurnoModalOpen(true);
    }
  };

  // estadísticas (placeholder)
  const stats = [
    { title: "Turnos programados", value: "En espera: 52" },
    { title: "Vehículo registrados", value: "Vehículos: 20" },
    { title: "Repuestos en stock", value: "Stock: 43" },
    { title: "Clientes activos", value: "Activos: 8" },
  ];

  // --- FUNCIÓN DE RENDERIZADO DE TABLAS ---
  const renderActiveTable = () => {
    const filterProps = { search, statusFilter, dateFrom, dateTo };
    switch (activeTab) {
      case "clientes":
        return (
          <ClientesTable
            filters={filterProps}
            isAddModalOpen={isAddClienteModalOpen}
            onAddModalClose={() => setIsAddClienteModalOpen(false)}
            onAddCliente={handleAddClienteApi}
          />
        );
      case "turnos":
        return (
          <TurnosTable
            filters={filterProps}
            isAddModalOpen={isAddTurnoModalOpen}
            onAddModalClose={() => setIsAddTurnoModalOpen(false)}
            onAddTurno={onAddTurno}
          />
        );
      default:
        return null;
    }
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleAddClienteApi = async (clienteData) => {
    // Usamos el mismo objeto 'api' que funciona en Register.jsx
    try {
      // La URL debe ser /users, que es el endpoint POST del administrador
      const response = await api.post("/users", clienteData);
      return response.data; // Axios devuelve data en la propiedad .data
    } catch (err) {
      // Axios siempre lanza el error con la propiedad response.data.message
      const errorMsg =
        err.response?.data?.message || "Error de red desconocido.";
      console.error("Error al registrar el cliente (Admin):", errorMsg);

      // CRÍTICO: Debemos lanzar un objeto de error que AddClienteModal pueda capturar.
      // AddClienteModal espera que el error tenga la propiedad .message
      throw new Error(errorMsg);
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

      {/* SECCIÓN DE TABLAS AHORA ES DE ANCHO COMPLETO */}
      <div className="tables-section full-width">
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
            <button className="action-btn add-btn" onClick={handleNewClick}>
              <FaPlus /> Nuevo
            </button>
          </div>
        </div>

        {/* Table container (max height control) */}
        <div className="table-container">{renderActiveTable()}</div>
      </div>
    </div>
  );
};

export default GestionesAdmin;
