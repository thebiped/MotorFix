import React, { useState } from "react";
import "./PerfilMecanico.css";

const PerfilMecanico = () => {
  const [activeTab, setActiveTab] = useState("Información Personal");

  const renderContent = () => {
    switch (activeTab) {
      case "Información Personal":
        return (
          <div className="profile-personal-info-content-mecanico">
            <div className="profile-info-item-mecanico">
              <span className="info-icon-mecanico">👤</span>
              <div>
                <p>Carlos Javier Rodríguez</p>
                <p className="info-label-mecanico">Nombre Completo</p>
              </div>
              <button className="edit-info-btn-mecanico">✏️</button>
            </div>

            <div className="profile-info-item-mecanico">
              <span className="info-icon-mecanico">📧</span>
              <div>
                <p>carlos.rodriguez@taller.com</p>
                <p className="info-label-mecanico">Correo Electrónico</p>
              </div>
              <button className="edit-info-btn-mecanico">✏️</button>
            </div>

            <div className="profile-info-item-mecanico">
              <span className="info-icon-mecanico">📞</span>
              <div>
                <p>+34 612 345 678</p>
                <p className="info-label-mecanico">Número de Teléfono</p>
              </div>
              <button className="edit-info-btn-mecanico">✏️</button>
            </div>

            <div className="profile-info-item-mecanico">
              <span className="info-icon-mecanico">📍</span>
              <div>
                <p>Madrid, España</p>
                <p className="info-label-mecanico">Dirección / Localidad</p>
              </div>
              <button className="edit-info-btn-mecanico">✏️</button>
            </div>
          </div>
        );

      case "Seguridad":
        return (
          <div className="profile-security-content-mecanico">
            <div className="security-item-mecanico">
              <h4>Contraseña y autenticación</h4>
              <button className="change-password-btn-mecanico">
                Cambiar Contraseña
              </button>
            </div>

            <div className="security-item-mecanico">
              <h4>Remover cuenta</h4>
              <p>
                Desactivar tu cuenta significaría que la inhabilitarías por un
                tiempo.
              </p>
              <button className="deactivate-account-btn-mecanico">
                Desactivar Cuenta
              </button>
              <button className="delete-account-btn-mecanico">
                Eliminar Cuenta
              </button>
            </div>
          </div>
        );

      case "Historial y Desempeño":
        return (
          <div className="performance-section-mecanico">
            <div className="stats-cards-mecanico">
              <div className="stat-card-mecanico">
                <h3>Ganancias Totales</h3>
                <div className="stat-value-mecanico">$9,500,650</div>
                <div className="stat-description-mecanico">
                  Generado este año
                </div>
              </div>

              <div className="stat-card-mecanico">
                <h3>Total Reparaciones</h3>
                <div className="stat-value-mecanico">185</div>
                <div className="stat-description-mecanico">
                  1–12 de este mes
                </div>
              </div>

              <div className="stat-card-mecanico">
                <h3>Tasa de Finalización</h3>
                <div className="stat-value-mecanico">96.5%</div>
                <div className="stat-description-mecanico">
                  Excelente desempeño
                </div>
              </div>

              <div className="stat-card-mecanico">
                <h3>Calificación Promedio</h3>
                <div className="stat-value-mecanico">4.8/5.0</div>
                <div className="stat-description-mecanico">Muy satisfecho</div>
              </div>
            </div>

            <div className="achievements-section-mecanico">
              <h3>Logros Destacados</h3>
              <div className="achievement-item-mecanico">
                🏆 Mecánico del Mes – Febrero 2024
              </div>
              <div className="achievement-item-mecanico">
                🎖️ 100 Reparaciones Completadas – Diciembre 2023
              </div>
              <div className="achievement-item-mecanico">
                📜 Especialista Certificado – Noviembre 2023
              </div>
            </div>

            <div className="certifications-mecanico">
              <h3>Certificaciones</h3>
              <div className="certification-item-mecanico">
                <div className="cert-info-mecanico">
                  <h4>Certificado de Mecánica</h4>
                  <p>Válido hasta: 15/01/2026</p>
                </div>
                <span className="status-badge-mecanico active-mecanico">
                  Activo
                </span>
              </div>

              <div className="certification-item-mecanico">
                <div className="cert-info-mecanico">
                  <h4>Certificado de Diagnóstico</h4>
                  <p>Válido hasta: 20/03/2025</p>
                </div>
                <span className="status-badge-mecanico active-mecanico">
                  Activo
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="perfil-mecanico-container">
      <div className="profile-header-mecanico">
        <div className="profile-banner-mecanico"></div>
        <div className="profile-picture-container-mecanico">
          <div className="profile-picture-mecanico"></div>
        </div>

        <div className="profile-header-info-mecanico">
          <div className="header-info-mecanico">
            <div className="info-mecanico">
              <h2>Carlos Rodríguez</h2>
              <span>Mecánico</span>
            </div>
            <button className="edit-profile-btn-mecanico">Editar perfil</button>
          </div>

          <p>
            Especialista en diagnóstico motor y sistemas eléctricos. Más de 10
            años de experiencia en mantenimiento automotriz integral.
          </p>
          <div className="profile-info-item-mecanico specialties-mecanico">
            <h4>Especialidades</h4>
            <div className="specialty-tags-mecanico">
              <span className="specialty-tag-mecanico">Diagnóstico Motor</span>
              <span className="specialty-tag-mecanico">
                Sistemas Eléctricos
              </span>
              <span className="specialty-tag-mecanico">Mecánica General</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-stats-mecanico">
        <div className="stat-item-mecanico">
          <h3>$9,500,650</h3>
          <p>Ganancias Totales</p>
        </div>

        <div className="stat-item-mecanico">
          <h3>185</h3>
          <p>Total Reparaciones</p>
        </div>

        <div className="stat-item-mecanico">
          <h3>4.8/5.0</h3>
          <p>Calificación Promedio</p>
        </div>
      </div>

      <div className="profile-nav-mecanico">
        <button
          onClick={() => setActiveTab("Información Personal")}
          className={activeTab === "Información Personal" ? "active" : ""}
        >
          Información Personal
        </button>

        <button
          onClick={() => setActiveTab("Seguridad")}
          className={activeTab === "Seguridad" ? "active" : ""}
        >
          Seguridad
        </button>

        <button
          onClick={() => setActiveTab("Historial y Desempeño")}
          className={activeTab === "Historial y Desempeño" ? "active" : ""}
        >
          Historial y Desempeño
        </button>
      </div>

      <div className="profile-content-mecanico">
        <div className="profile-content-cont-mecanico">{renderContent()}</div>
      </div>
    </div>
  );
};

export default PerfilMecanico;
