import { useState } from "react";
import "./TurnosCliente.css";

const rows = [
  {
    id: 1,
    fecha: "19/03/2024",
    hora: "09:00",
    vehiculo: "Volkswagen Gol 2019",
    servicio: "Cambio de aceite y filtros",
    mecanico: "Ana García",
    estado: "En progreso",
  },
  {
    id: 2,
    fecha: "19/03/2024",
    hora: "10:30",
    vehiculo: "Volkswagen Gol 2019",
    servicio: "Cambio de aceite y filtros",
    mecanico: "Ana García",
    estado: "Pendiente",
  },
  {
    id: 3,
    fecha: "19/03/2024",
    hora: "11:00",
    vehiculo: "Volkswagen Gol 2019",
    servicio: "Cambio de aceite y filtros",
    mecanico: "Ana García",
    estado: "Completado",
  },
  {
    id: 4,
    fecha: "19/03/2024",
    hora: "13:00",
    vehiculo: "Volkswagen Gol 2019",
    servicio: "Cambio de aceite y filtros",
    mecanico: "Ana García",
    estado: "En progreso",
  },
  {
    id: 5,
    fecha: "19/03/2024",
    hora: "15:00",
    vehiculo: "Volkswagen Gol 2019",
    servicio: "Cambio de aceite y filtros",
    mecanico: "Ana García",
    estado: "En progreso",
  },
];

const StatusPill = ({ status }) => {
  const cls =
    status === "Pendiente"
      ? "pill pending"
      : status === "Completado"
      ? "pill done"
      : "pill progress";

  return <div className={cls}>{status}</div>;
};

const TurnosCliente = () => {
  // <-- AHORA SÍ: LOS HOOKS DENTRO DEL COMPONENTE
  const [showModal, setShowModal] = useState(false);
  const [problema, setProblema] = useState("");
  const [tipoReparacion, setTipoReparacion] = useState("");
  const [vehiculoId, setVehiculoId] = useState("");

  const handleCrearTurno = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/turnos/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1,
          vehicle_id: vehiculoId,
          problema,
          tipo_reparacion: tipoReparacion,
        }),
      });

      const data = await response.json();
      console.log("Turno creado:", data);

      alert("Turno creado con éxito");
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert("Error al crear turno");
    }
  };

  return (
    <div className="turnos-container">
      <div className="turnos-top">
        <div>
          <h1>MIS TURNOS</h1>
          <p className="subtitle">Gestiona tus citas y servicios programados</p>
        </div>
      </div>

      <div className="metrics">
        <div className="metric big">
          <h4>Total Turnos</h4>
          <div className="value">$45.200</div>
        </div>
        <div className="metric">
          <h4>Pendientes</h4>
          <div className="value">3</div>
        </div>
        <div className="metric">
          <h4>Completados</h4>
          <div className="value">8</div>
        </div>
        <div className="metric">
          <h4>Confirmados</h4>
          <div className="value">12</div>
        </div>
      </div>

      <div className="tabs">
        <button className="tab active">Todas (5)</button>
        <button className="tab">Pendientes (2)</button>
        <button className="tab">En progreso (1)</button>
        <button className="tab">Completadas (2)</button>
      </div>

      <div className="datos-vehiculos turnos-table-card">
        <div className="datos-header">
          <h2>DATOS VEHICULOS</h2>
          <div className="datos-actions">
            <button className="btn-primary">Descargar PDF</button>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              Nuevo Turno
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="turnos-table">
            <thead>
              <tr>
                <th></th>
                <th>Fecha y Hora</th>
                <th>Vehículo</th>
                <th>Servicio</th>
                <th>Mecánico</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{`${r.fecha} • ${r.hora}`}</td>
                  <td>
                    <div className="patente">{r.patente}</div>
                    <div className="vehiculo">{r.vehiculo}</div>
                  </td>
                  <td className="servicio">{r.servicio}</td>
                  <td>{r.mecanico}</td>
                  <td>
                    <StatusPill status={r.estado} />
                  </td>
                  <td>
                    <div className="datos-actions">
                      <button className="link">Borrar</button>
                      <button className="link">Editar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="pg">‹</button>
          <button className="pg active">1</button>
          <button className="pg">2</button>
          <button className="pg">3</button>
          <span className="dots">...</span>
          <button className="pg">24</button>
          <button className="pg">›</button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Nuevo Turno</h2>

            <div className="field">
              <label>Problema del vehículo</label>
              <input
                type="text"
                value={problema}
                onChange={(e) => setProblema(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Tipo de reparación</label>
              <select
                value={tipoReparacion}
                onChange={(e) => setTipoReparacion(e.target.value)}
              >
                <option value="">Seleccionar</option>
                <option value="mecanica">Mecánica</option>
                <option value="electrico">Eléctrico</option>
                <option value="service">Service</option>
                <option value="chapa">Chapa y pintura</option>
              </select>
            </div>

            <div className="field">
              <label>Vehículo</label>
              <input
                type="text"
                placeholder="ID del vehículo"
                value={vehiculoId}
                onChange={(e) => setVehiculoId(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleCrearTurno}>
                Crear Turno
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnosCliente;
