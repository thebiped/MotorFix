import React, { useState } from "react";
import "./PerfilAdmin.css";

const PerfilAdmin = () => {
  const [activeTab, setActiveTab] = useState("Informacion Personal");

  const renderContent = () => {
    switch (activeTab) {
      case "Informacion Personal":
        return (
          <div className="profile-personal-info-content-admin">
            <div className="profile-info-item-admin">
              <span className="info-icon-admin">📧</span>
              <div>
                <p>admin@motorfix.com</p>
                <p className="info-label-admin">Correo Electrónico</p>
              </div>
              <button className="edit-info-btn-admin">✏️</button>
            </div>
            <div className="profile-info-item-admin">
              <span className="info-icon-admin">📞</span>
              <div>
                <p>+54 11 5555-5555</p>
                <p className="info-label-admin">Número de Teléfono</p>
              </div>
              <button className="edit-info-btn-admin">✏️</button>
            </div>
            <div className="profile-info-item-admin">
              <span className="info-icon-admin">🏢</span>
              <div>
                <p>Av. Mitre 1200, Avellaneda, Buenos Aires</p>
                <p className="info-label-admin">Dirección del Taller</p>
              </div>
              <button className="edit-info-btn-admin">✏️</button>
            </div>
          </div>
        );

      case "Gestion de Mecanicos":
        return (
          <div className="profile-gestion-content-admin">
            <h4>Mecánicos registrados</h4>
            <p>
              Aquí podés visualizar, editar o eliminar perfiles de los
              mecánicos activos.
            </p>
            <div className="mechanic-item-admin">
              <div className="mechanic-info-admin">
                <div className="mechanic-avatar-admin"></div>
                <div>
                  <p className="mechanic-name-admin">Juan Pérez</p>
                  <p className="mechanic-specialty-admin">
                    Mecánico especialista en motores
                  </p>
                  <p className="mechanic-status-admin">Estado: Activo</p>
                </div>
              </div>
              <div className="mechanic-buttons-admin">
                <button className="view-profile-btn-admin">Editar</button>
                <button className="consult-btn-admin">Eliminar</button>
              </div>
            </div>
          </div>
        );

      case "Panel de Control":
        return (
          <div className="profile-panel-content-admin">
            <h4>Panel de control general</h4>

            <div className="dashboard-stats-admin">
              <div className="stat-item-admin">
                <h3>12</h3>
                <p>Mecánicos Activos</p>
              </div>
              <div className="stat-item-admin">
                <h3>84</h3>
                <p>Servicios Completados</p>
              </div>
              <div className="stat-item-admin">
                <h3>$15.250</h3>
                <p>Ingresos del Mes</p>
              </div>
            </div>

            {/* 🔐 Sección de Seguridad */}
            <div className="profile-security-content">
              <h4>Seguridad de la Cuenta</h4>

              <div className="security-item">
                <h5>Contraseña y autenticación</h5>
                <button className="change-password-btn">
                  Cambiar Contraseña
                </button>
              </div>

              <div className="security-item">
                <h5>Remover cuenta</h5>
                <p>
                  Desactivar tu cuenta significaría que la inhabilitarías por un
                  tiempo sin perder tus datos. También podés eliminarla
                  permanentemente.
                </p>
                <div className="security-buttons admin">
                  <button className="deactivate-account-btn admin">
                    Desactivar Cuenta
                  </button>
                  <button className="delete-account-btn admin">
                    Eliminar Cuenta
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="perfil-admin-container">
      <div className="profile-header-admin">
        <div className="profile-banner-admin"></div>
        <div className="profile-picture-container-admin">
          <div className="profile-picture-admin"></div>
        </div>

        <div className="profile-header-info-admin">
          <div className="header-info-admin">
            <div className="info-admin">
              <h2>Administrador</h2>
              <span>Administrador del Sistema</span>
            </div>
            <button className="edit-profile-btn-admin">Editar perfil</button>
          </div>
          <p>
            Bienvenido al panel de administración de Motorfix. Desde aquí podés
            gestionar usuarios, mecánicos y estadísticas generales del sistema.
          </p>
        </div>
      </div>

      <div className="profile-stats-admin">
        <div className="stat-item-admin">
          <h3>$250.000</h3>
          <p>Ingresos Totales</p>
        </div>
        <div className="stat-item-admin">
          <h3>34</h3>
          <p>Mecánicos Registrados</p>
        </div>
        <div className="stat-item-admin">
          <h3>98%</h3>
          <p>Satisfacción General</p>
        </div>
      </div>

      <div className="profile-nav-admin">
        <button
          onClick={() => setActiveTab("Informacion Personal")}
          className={activeTab === "Informacion Personal" ? "active" : ""}
        >
          Información Personal
        </button>
        <button
          onClick={() => setActiveTab("Gestion de Mecanicos")}
          className={activeTab === "Gestion de Mecanicos" ? "active" : ""}
        >
          Gestión de Mecánicos
        </button>
        <button
          onClick={() => setActiveTab("Panel de Control")}
          className={activeTab === "Panel de Control" ? "active" : ""}
        >
          Panel de Control
        </button>
      </div>

      <div className="profile-content-admin">
        <div className="profile-content-cont-admin">{renderContent()}</div>
      </div>
    </div>
  );
};

export default PerfilAdmin;
