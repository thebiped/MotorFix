import React from "react";
import { Edit, Shield } from "lucide-react";
import "./PerfilAdmin.css";

const horarios = [
  ["Lunes", "08:00 Hs", "18:00 Hs", "Abierto"],
  ["Martes", "08:00 Hs", "18:00 Hs", "Abierto"],
  ["Miércoles", "08:00 Hs", "18:00 Hs", "Abierto"],
  ["Jueves", "-", "-", "Cerrado"],
  ["Viernes", "08:00 Hs", "18:00 Hs", "Abierto"],
  ["Sábado", "08:00 Hs", "18:00 Hs", "Abierto"],
  ["Domingo", "-", "-", "Cerrado"],
];

const PerfilAdmin = () => {
  return (
    <div className="perfil-page">
      <div className="perfil-container">
        <div className="perfil-card perfil-info-card">
          <div className="perfil-header">
            <h1>Mi Perfil</h1>
            <button className="edit-btn" aria-label="Editar perfil">
              <Edit size={16} />
            </button>
          </div>

          <div className="perfil-body">
            <div className="perfil-avatar-col">
              <div className="perfil-avatar">U</div>
              <div className="perfil-role">Rol Administrador</div>
            </div>

            <div className="perfil-details">
              <div className="perfil-row">
                <div>
                  <label>Nombre:</label>
                  <p>Usuario</p>
                </div>
                <div>
                  <label>Email:</label>
                  <p>usuario@gmail.com</p>
                </div>
                <div>
                  <label>Teléfono:</label>
                  <p>+54 11 9876-5432</p>
                </div>
              </div>
              <div className="perfil-row">
                <div>
                  <label>Dirección:</label>
                  <p>Av. San Martín, San Isidro, Buenos Aires.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="perfil-side">
          <div className="perfil-card">
            <div className="perfil-section-header">
              <Shield />
              <h2>Contraseña y autenticación</h2>
            </div>
            <button className="btn btn-primary">Cambiar Contraseña</button>
          </div>

          <div className="perfil-card">
            <div className="perfil-section-header">
              <Shield />
              <h2>Remover cuenta</h2>
            </div>
            <p className="perfil-text">
              Desactivar tu cuenta significaría que la inhabilitarías por un
              tiempo.
            </p>
            <div className="perfil-btn-group">
              <button className="btn btn-danger">Desactivar Cuenta</button>
              <button className="btn btn-outline">Eliminar Cuenta</button>
            </div>
          </div>
        </div>
      </div>

      <section className="perfil-card horarios-card">
        <div className="horarios-header">
          <h3>Horarios de atención</h3>
          <button className="btn btn-outline">Editar</button>
        </div>
        <table className="horarios-table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Apertura</th>
              <th>Cierre</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {horarios.map(([dia, apertura, cierre, estado]) => (
              <tr key={dia}>
                <td>{dia}</td>
                <td className="hora">{apertura}</td>
                <td className="hora">{cierre}</td>
                <td>
                  <select
                    defaultValue={estado}
                    className={`estado ${estado === "Cerrado" ? "cerrado" : ""}`}
                  >
                    <option>Abierto</option>
                    <option>Cerrado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default PerfilAdmin;
