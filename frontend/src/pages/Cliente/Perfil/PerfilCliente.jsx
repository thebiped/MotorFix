import React, { useState } from "react";
import "./PerfilCliente.css";

const PerfilCliente = () => {
  const [activeTab, setActiveTab] = useState("Informacion Personal");

  const renderContent = () => {
    switch (activeTab) {
      case "Informacion Personal":
        return (
          <div className="profile-personal-info-content">
            <div className="profile-info-item">
              <span className="info-icon">📧</span>
              <div>
                <p>usuario@gmail.com</p>
                <p className="info-label">Correo Electronico</p>
              </div>
              <button className="edit-info-btn">✏️</button>
            </div>
            <div className="profile-info-item">
              <span className="info-icon">📞</span>
              <div>
                <p>+51 11 1234-5678</p>
                <p className="info-label">Número de Teléfono</p>
              </div>
              <button className="edit-info-btn">✏️</button>
            </div>
            <div className="profile-info-item">
              <span className="info-icon">📍</span>
              <div>
                <p>Av. Corrientes 1234, CABA</p>
                <p className="info-label">Dirección / Localidad</p>
              </div>
              <button className="edit-info-btn">✏️</button>
            </div>
          </div>
        );
      case "Seguridad":
        return (
          <div className="profile-security-content">
            <div className="security-item">
              <h4>Contraseña y autenticación</h4>
              <button className="change-password-btn">
                Cambiar Contraseña
              </button>
            </div>
            <div className="security-item">
              <h4>Remover cuenta</h4>
              <p>
                Desactivar tu cuenta significaría que la inhabilitarías por un
                tiempo
              </p>
              <button className="deactivate-account-btn">
                Desactivar Cuenta
              </button>
              <button className="delete-account-btn">Eliminar Cuenta</button>
            </div>
          </div>
        );
      case "Contactos de Taller":
        return (
          <div className="profile-workshop-contacts-content">
            <h4>Mecánicos con los que trabajaste</h4>
            <div className="mechanic-item">
              <div className="mechanic-info">
                <div className="mechanic-avatar"></div>
                <div>
                  <p className="mechanic-name">Nombre completo</p>
                  <p className="mechanic-specialty">Mecánico especialista</p>
                  <p className="mechanic-last-service">
                    Último servicio: 14/04/2025
                  </p>
                  <div className="mechanic-rating">⭐⭐⭐⭐⭐</div>
                  <div className="mechanic-actions">👍 👎 ❤️</div>
                </div>
              </div>
              <div className="mechanic-buttons">
                <button className="view-profile-btn">Ver perfil</button>
                <button className="consult-btn">Consultar</button>
              </div>
            </div>
            <div className="mechanic-item">
              <div className="mechanic-info">
                <div className="mechanic-avatar"></div>
                <div>
                  <p className="mechanic-name">Nombre completo</p>
                  <p className="mechanic-specialty">Mecánico especialista</p>
                  <p className="mechanic-last-service">
                    Último servicio: 14/04/2025
                  </p>
                  <div className="mechanic-rating">⭐⭐⭐⭐⭐</div>
                  <div className="mechanic-actions">👍 👎 ❤️</div>
                </div>
              </div>
              <div className="mechanic-buttons">
                <button className="view-profile-btn">Ver perfil</button>
                <button className="consult-btn">Consultar</button>
              </div>
            </div>
            <h4>Mecánicos Favoritos</h4>
            <div className="mechanic-item">
              <div className="mechanic-info">
                <div className="mechanic-avatar"></div>
                <div>
                  <p className="mechanic-name">Nombre completo</p>
                  <div className="mechanic-rating">⭐⭐⭐⭐⭐</div>
                  <div className="mechanic-actions">👍 👎 ❤️</div>
                </div>
              </div>
              <div className="mechanic-buttons">
                <button className="view-profile-btn">Ver perfil</button>
                <button className="consult-btn">Consultar</button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="perfil-cliente-container">
      <div className="profile-header">
        <div className="profile-banner"></div>
        <div className="profile-picture-container">
          <div className="profile-picture"></div>
        </div>
        <div className="profile-header-info">
          <div className="header-info">
            <div className="info">
              <h2>Usuario C</h2>
              <span>Cliente</span>
            </div>
            <button className="edit-profile-btn">Editar perfil</button>
          </div>
          <p>
            lorem ipsum dolor sit amet consectetur adipiscing elit dis dignissim
            sociis libero class, euismod blandit semper metus sollicitudin at
            vehicula turpis lobortis per facilisis.
          </p>
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat-item">
          <h3>$106.500</h3>
          <p>Gasto Total</p>
        </div>
        <div className="stat-item">
          <h3>12</h3>
          <p>Total de Servicios</p>
        </div>
        <div className="stat-item">
          <h3>14.8/5.02</h3>
          <p>Satisfacción Promedio</p>
        </div>
      </div>
      <div className="profile-nav">
        <button
          onClick={() => setActiveTab("Informacion Personal")}
          className={activeTab === "Informacion Personal" ? "active" : ""}
        >
          Informacion Personal
        </button>
        <button
          onClick={() => setActiveTab("Seguridad")}
          className={activeTab === "Seguridad" ? "active" : ""}
        >
          Seguridad
        </button>
        <button
          onClick={() => setActiveTab("Contactos de Taller")}
          className={activeTab === "Contactos de Taller" ? "active" : ""}
        >
          Contactos de Taller
        </button>
      </div>
      <div className="profile-content">
        <div className="profile-content-cont">{renderContent()}</div>
      </div>
    </div>
  );
};

export default PerfilCliente;
