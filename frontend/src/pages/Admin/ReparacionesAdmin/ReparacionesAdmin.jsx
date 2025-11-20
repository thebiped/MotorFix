import { useState, useMemo } from "react";
import ReparacionRow from "./ReparacionRow";
import "./ReparacionesAdmin.css"; // Asegúrate de que el CSS actualizado esté aquí

// Opciones estáticas para filtros
const ESTADOS = ["Todos", "Completado", "En progreso", "Pendiente"];
const TIPOS = ["", "Motor", "Frenos", "Eléctrico"]; // El "" es para 'Todos'
const PRIORIDADES = ["", "Alta", "Media", "Baja"]; // El "" es para 'Todas'

const ReparacionesAdmin = () => {
  const [activeFilter, setActiveFilter] = useState("Todos"); // Para las pestañas de estado
  const [searchClient, setSearchClient] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterPrioridad, setFilterPrioridad] = useState("");

  const reparaciones = [
    {
      id: 1,
      title: "Cambio de aceite",
      client: "Mario Pérez",
      status: "Completado",
      tipo: "Motor",
      prioridad: "Alta",
      total: 1200,
      dateFrom: "01/10/2025",
      dateTo: "02/10/2025",
    },
    {
      id: 2,
      title: "Frenos delanteros",
      client: "Juan Gómez",
      status: "En progreso",
      tipo: "Frenos",
      prioridad: "Media",
      total: 1500,
      dateFrom: "03/10/2025",
      dateTo: "05/10/2025",
    },
    {
      id: 3,
      title: "Cambio de batería",
      client: "Ana López",
      status: "Pendiente",
      tipo: "Eléctrico",
      prioridad: "Baja",
      total: 800,
      dateFrom: "07/10/2025",
      dateTo: "08/10/2025",
    },
    // Podrías agregar más datos aquí
  ];

  // Aplicamos el filtrado con useMemo para optimizar el rendimiento
  const filteredReparaciones = useMemo(() => {
    return reparaciones.filter((r) => {
      const matchEstado =
        activeFilter === "Todos" ? true : r.status === activeFilter;
      const matchClient =
        searchClient === ""
          ? true
          : r.client.toLowerCase().includes(searchClient.toLowerCase());
      const matchTipo = filterTipo === "" ? true : r.tipo === filterTipo;
      const matchPrioridad =
        filterPrioridad === "" ? true : r.prioridad === filterPrioridad;

      return matchEstado && matchClient && matchTipo && matchPrioridad;
    });
  }, [reparaciones, activeFilter, searchClient, filterTipo, filterPrioridad]);

  // Se eliminan las funciones applyFilters y clearFilters ya que los filtros
  // se aplican de manera reactiva con los estados.
  // Podrías reintroducir un 'clearFilters' para resetear todos los estados si lo necesitas.

  return (
    <div className="reparaciones-admin-container">
      {/* Encabezado y Acciones */}

      {/* Tarjetas de Estadísticas - Diseño tipo Gráfico HUD */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Ingresos de Hoy</p>
          <h2 className="stat-value">$43,000</h2>
        </div>
        <div className="stat-card">
          <p className="stat-label">Finalizados Hoy</p>
          <h2 className="stat-value">2</h2>
        </div>
        <div className="stat-card">
          <p className="stat-label">Activos</p>
          <h2 className="stat-value">3</h2>
        </div>
        <div className="stat-card accent-card">
          <p className="stat-label">Alta Prioridad</p>
          <h2 className="stat-value">2</h2>
        </div>
      </div>

      {/* Contenedor Principal de la Lista */}
      <div className="list-panel">
        {/* Pestañas de Estado (Filtro Rápido) */}
        <div className="status-tabs-hud">
          {ESTADOS.map((estado) => (
            <button
              key={estado}
              className={`status-tab ${
                activeFilter === estado ? "active" : ""
              }`}
              onClick={() => setActiveFilter(estado)}
            >
              {estado}
            </button>
          ))}
          <div className="status-tabs-hub-button">
            <button className="add-order-btn hud-button-accent">
              + Agregar Orden
            </button>
          </div>
        </div>

        {/* Panel de Filtros Secundarios */}
        <div className="filters-panel">
          <div className="filter-group">
            <input
              type="text"
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              placeholder="Buscar por cliente, título..."
              className="hud-input"
            />
          </div>

          <div className="filter-group">
            <label className="hud-label">Tipo</label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="hud-select"
            >
              <option value="">Todos</option>
              {TIPOS.filter((t) => t !== "").map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="hud-label">Prioridad</label>
            <select
              value={filterPrioridad}
              onChange={(e) => setFilterPrioridad(e.target.value)}
              className="hud-select"
            >
              <option value="">Todas</option>
              {PRIORIDADES.filter((p) => p !== "").map((prio) => (
                <option key={prio} value={prio}>
                  {prio}
                </option>
              ))}
            </select>
          </div>
        </div> 

        {/* Lista de Reparaciones */}
        <div className="reparaciones-list">
          {filteredReparaciones.length > 0 ? (
            filteredReparaciones.map((r) => (
              // Asumo que ReparacionRow también usará las nuevas clases CSS
              <ReparacionRow key={r.id} reparacion={r} />
            ))
          ) : (
            <div className="no-results hud-no-results">
              <p>No se encontraron reparaciones con los filtros aplicados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReparacionesAdmin;
