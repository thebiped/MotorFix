import React from 'react';

const HistorialVehiculo = ({ onBack }) => {
  const historial = [
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'Finalizado', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'Finalizado', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'Finalizado', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'En progreso', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
    { id: '#001', fechaIngreso: '15/03/2024', fechaSalida: '16/03/2024', tipo: 'Usuario M', mecanico: 'Cambio de frenos', estado: 'Finalizado', observaciones: 'Se cambiaron pastillas y se rectificaron discos.' },
  ];

  return (
    <div className="historial-vehiculo-container">
      <div className="historial-content">
        <button onClick={onBack} className="back-button">&lt; Volver</button>
        <h3>Historial del Vehículo</h3>
        <p>Historial del Vehículo de reparaciones y mantenimientos realizados al vehículo</p>
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
          {historial.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.fechaIngreso}</td>
              <td>{item.fechaSalida}</td>
              <td>{item.tipo}</td>
              <td>{item.mecanico}</td>
              <td><span className={`status-historial ${item.estado.toLowerCase().replace(' ', '-')}`}>{item.estado}</span></td>
              <td>{item.observaciones}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default HistorialVehiculo;
