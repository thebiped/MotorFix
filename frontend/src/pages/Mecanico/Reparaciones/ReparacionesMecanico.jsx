import React from "react";
import "./ReparacionesMecanico.css";

const ReparacionesMecanico = () => {
  return (
    <div className="reparaciones-container">
      <div className="reparaciones-header">
        <div className="header-title">
          <h1>Gestión de Autos</h1>
          <p>Administra los vehículos en reparación y sus estados</p>
        </div>
        <div className="header-buttons">
          <button className="btn-exportar">
            <i className="fas fa-download"></i> Exportar
          </button>
          <button className="btn-nueva-reparacion">
            <i className="fas fa-plus"></i> Nueva Reparación
          </button>
        </div>
      </div>

      <div className="status-cards">
        <div className="status-card">
          <h3>Total Asignadas</h3>
          <div className="card-content">
            <span className="number">4</span>
            <p>Órdenes de trabajo</p>
          </div>
        </div>
        <div className="status-card">
          <h3>En progreso</h3>
          <div className="card-content">
            <span className="number">2</span>
            <p>Trabajos activos</p>
          </div>
        </div>
        <div className="status-card">
          <h3>Pendientes</h3>
          <div className="card-content">
            <span className="number">1</span>
            <p>Por iniciar</p>
          </div>
        </div>
        <div className="status-card">
          <h3>Completadas</h3>
          <div className="card-content">
            <span className="number">1</span>
            <p>Finalizadas</p>
          </div>
        </div>
      </div>

      <div className="filters">
        <button className="filter-btn active">Todas (5)</button>
        <button className="filter-btn">Pendientes (2)</button>
        <button className="filter-btn">En progreso (1)</button>
        <button className="filter-btn">Completadas (2)</button>
      </div>

      <div className="reparaciones-table">
        <div className="table-header">
          <div className="table-row">
            <div className="checkbox-cell"></div>
            <div className="header-cell">Patente</div>
            <div className="header-cell">Marca/Modelo</div>
            <div className="header-cell">Cliente</div>
            <div className="header-cell">Problema</div>
            <div className="header-cell">Estado</div>
            <div className="header-cell">Fecha Ingreso</div>
            <div className="header-cell">Fecha Estimada</div>
            <div className="header-cell">Costo</div>
          </div>
        </div>
        <div className="table-body">
          {/* Example row */}
          <div className="table-row">
            <div className="checkbox-cell">
              <input type="checkbox" />
            </div>
            <div className="cell">DEF 456</div>
            <div className="cell">Volkswagen Gol 2019</div>
            <div className="cell">Ana García</div>
            <div className="cell">Cambio de aceite y filtros</div>
            <div className="cell">
              <span className="status en-progreso">En progreso</span>
            </div>
            <div className="cell">12/03/2024</div>
            <div className="cell">14/03/2024</div>
            <div className="cell">$4050</div>
          </div>
          {/* Add more rows as needed */}
        </div>
      </div>

      <div className="pagination">
        <button className="pagination-btn"><i className="fas fa-chevron-left"></i></button>
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">2</button>
        <button className="pagination-btn">3</button>
        <button className="pagination-btn">4</button>
        <button className="pagination-btn">5</button>
        <button className="pagination-btn">6</button>
        <span>...</span>
        <button className="pagination-btn">24</button>
        <button className="pagination-btn"><i className="fas fa-chevron-right"></i></button>
      </div>
    </div>
  );
};

export default ReparacionesMecanico;
