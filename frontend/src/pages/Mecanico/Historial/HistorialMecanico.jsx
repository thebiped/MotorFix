import React from 'react';
import './HistorialMecanico.css';

const HistorialMecanico = () => {
  return (
    <div className="historial-container">
      <div className="historial-header">
        <div className="header-title">
          <h1>Historial de Reparaciones</h1>
          <p>Revisa todas tus reparaciones completadas</p>
        </div>
        <button className="btn-descargar">
          <i className="fas fa-download"></i> Descargar Historial
        </button>
      </div>

      <div className="status-cards">
        <div className="status-card">
          <h3>Total Reparaciones</h3>
          <div className="card-content">
            <span className="number">26</span>
            <p>Completadas</p>
          </div>
        </div>
        <div className="status-card">
          <h3>Ganancias Totales</h3>
          <div className="card-content">
            <span className="number">$3000250</span>
            <p>En reparaciones</p>
          </div>
        </div>
        <div className="status-card">
          <h3>Calificación Promedio</h3>
          <div className="card-content">
            <span className="number">4.9/5.0</span>
            <p>Satisfacción de clientes</p>
          </div>
        </div>
      </div>

      <div className="historial-table">
        <div className="table-header">
          <div className="search-bar">
            <i className="fas fa-search search-icon"></i>
            <input 
              type="text" 
              placeholder="Buscar por cliente o vehículos..." 
              className="search-input"
            />
          </div>
          <div className="table-actions">
            <button className="btn-borrar">Borrar</button>
            <button className="btn-editar">Editar</button>
          </div>
        </div>

        <div className="datos-vehiculos">
          <h2>DATOS VEHÍCULOS</h2>
          <div className="table-content">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Patente</th>
                  <th>Vehículo</th>
                  <th>Cliente</th>
                  <th>Trabajo Realizado</th>
                  <th>Fecha Ingreso</th>
                  <th>Fecha Estimada</th>
                  <th>Costo</th>
                  <th>Calificación</th>
                </tr>
              </thead>
              <tbody>
                {/* Example row */}
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>DEF 456</td>
                  <td>Volkswagen Gol 2019</td>
                  <td>Ana García</td>
                  <td>Cambio de aceite y filtros</td>
                  <td>12/03/2024</td>
                  <td>14/03/2024</td>
                  <td>$4050</td>
                  <td>5★</td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
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
    </div>
  );
};

export default HistorialMecanico;
