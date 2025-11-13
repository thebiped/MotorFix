import React from 'react';
import './HistorialVehiculo.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const HistorialVehiculo = ({ onBack }) => {
  const reparaciones = [
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'En progreso', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'Finalizado', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'Finalizado', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'Finalizado', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'Finalizado', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'Finalizado', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
  ];

  return (
    <div className="historial-vehiculo-container">
      <div className="historial-header">
        <button className="back-button" onClick={onBack}>
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </button>
        <h2>Historial del Vehículo</h2>
        <p>Historial de reparaciones y mantenimientos realizados al vehículo</p>
      </div>
      <table className="historial-table">
        <thead>
          <tr>
            <th>N° Reparaciones</th>
            <th>Fecha Ingreso</th>
            <th>Fecha Salida</th>
            <th>Tipo de Reparación</th>
            <th>Mecánico Asignado</th>
            <th>Estado</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {reparaciones.map((rep, index) => (
            <tr key={index}>
              <td>{rep.id}</td>
              <td>{rep.fechaIngreso}</td>
              <td>{rep.fechaSalida}</td>
              <td>{rep.tipo}</td>
              <td>{rep.mecanico}</td>
              <td>
                <span className={`status ${rep.estado.toLowerCase().replace(' ', '-')}`}>
                  {rep.estado}
                </span>
              </td>
              <td>{rep.observaciones}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialVehiculo;
