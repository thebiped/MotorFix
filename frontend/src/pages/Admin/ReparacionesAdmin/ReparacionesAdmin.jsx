import { useState } from 'react';
import ReparacionRow from './ReparacionRow';
import './ReparacionesAdmin.css';

const ReparacionesAdmin = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchClient, setSearchClient] = useState("");
  const [filterState, setFilterState] = useState("Todos");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterPrioridad, setFilterPrioridad] = useState("");

  const reparaciones = [
    { id: 1, title: 'Cambio de aceite', client: 'Mario Pérez', status: 'Completado', tipo: 'Motor', prioridad: 'Alta', total: 1200, dateFrom: '01/10/2025', dateTo: '02/10/2025' },
    { id: 2, title: 'Frenos delanteros', client: 'Juan Gómez', status: 'En progreso', tipo: 'Frenos', prioridad: 'Media', total: 1500, dateFrom: '03/10/2025', dateTo: '05/10/2025' },
    { id: 3, title: 'Cambio de batería', client: 'Ana López', status: 'Pendiente', tipo: 'Eléctrico', prioridad: 'Baja', total: 800, dateFrom: '07/10/2025', dateTo: '08/10/2025' },
  ];

  const estados = ['Todos', 'Completado', 'En progreso', 'Pendiente'];

  const applyFilters = () => {
    setActiveFilter(filterState);
  };

  const clearFilters = () => {
    setSearchClient("");
    setFilterState("Todos");
    setFilterTipo("");
    setFilterPrioridad("");
    setActiveFilter("Todos");
  };

  const filteredReparaciones = reparaciones.filter(r => {
    const matchEstado = activeFilter === 'Todos' ? true : r.status === activeFilter;
    const matchClient = searchClient === "" ? true : r.client.toLowerCase().includes(searchClient.toLowerCase());
    const matchTipo = filterTipo === "" ? true : r.tipo === filterTipo;
    const matchPrioridad = filterPrioridad === "" ? true : r.prioridad === filterPrioridad;
    return matchEstado && matchClient && matchTipo && matchPrioridad;
  });

  return (
    <div className="reparaciones-admin-container">
      {/* Encabezado y Acciones */}
      <div className="reparaciones-header">
        <h1>Gestión de Reparaciones</h1>
        <button className="add-order-btn">Agregar orden de trabajo</button>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="reparaciones-stats-cards">
        <div className="reparacion-card">
          <p>Ingresos de hoy</p>
          <h2>$43,000</h2>
        </div>
        <div className="reparacion-card">
          <p>Finalizados Hoy</p>
          <h2>2</h2>
        </div>
        <div className="reparacion-card">
          <p>Activos</p>
          <h2>3</h2>
        </div>
        <div className="reparacion-card">
          <p>Alta Prioridad</p>
          <h2>2</h2>
        </div>
      </div>

      {/* Contenedor de Filtros y Lista */}
      <div className="reparaciones-list-container">
        {/* Filtros */}
        <div className="reparaciones-filters-panel">
          <div className="filter-group">
            <input 
              type="text" 
              value={searchClient} 
              onChange={(e) => setSearchClient(e.target.value)} 
              placeholder="Buscar por cliente..." 
            />
          </div>
          <div className="filter-group">
            <label>Tipo</label>
            <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}>
              <option value="">Todos</option>
              <option value="Motor">Motor</option>
              <option value="Frenos">Frenos</option>
              <option value="Eléctrico">Eléctrico</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Prioridad</label>
            <select value={filterPrioridad} onChange={e => setFilterPrioridad(e.target.value)}>
              <option value="">Todas</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          <div className="filter-actions">
            <button className="clear-filter-btn" onClick={clearFilters}>Limpiar</button>
            <button className="apply-filter-btn" onClick={applyFilters}>Aplicar</button>
          </div>
        </div>

        {/* Pestañas de Estado */}
        <div className="reparaciones-status-tabs">
          {estados.map(estado => (
            <button
              key={estado}
              className={`status-tab ${activeFilter === estado ? 'active' : ''}`}
              onClick={() => setActiveFilter(estado)}
            >
              {estado}
            </button>
          ))}
        </div>

        {/* Lista de Reparaciones */}
        <div className="reparaciones-list">
          <p className="showing-results">
            Mostrando {filteredReparaciones.length} de {reparaciones.length} reparaciones
          </p>
          {filteredReparaciones.length > 0 ? (
            filteredReparaciones.map(r => (
              <ReparacionRow key={r.id} reparacion={r} />
            ))
          ) : (
            <p className="no-results">No se encontraron reparaciones con los filtros aplicados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReparacionesAdmin;
