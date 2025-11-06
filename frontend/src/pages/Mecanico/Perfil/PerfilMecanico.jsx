import React from 'react';
import './PerfilMecanico.css';

const PerfilMecanico = () => {
  return (
    <div className="perfil-container">
      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Ganancias Totales</h3>
          <div className="stat-value">$9500650</div>
          <div className="stat-description">Generado este año</div>
        </div>
        <div className="stat-card">
          <h3>Total Reparaciones</h3>
          <div className="stat-value">185</div>
          <div className="stat-description">1-12 de este mes</div>
        </div>
        <div className="stat-card">
          <h3>Tasa de Finalización</h3>
          <div className="stat-value">96.5%</div>
          <div className="stat-description">Excelente desempeño</div>
        </div>
        <div className="stat-card">
          <h3>Calificación Promedio</h3>
          <div className="stat-value">4.8/5.0</div>
          <div className="stat-description">Muy satisfecho</div>
        </div>
      </div>

      <div className="profile-content">
        {/* Profile Info */}
        <div className="profile-section">
          <div className="section-header">
            <h2>MI PERFIL</h2>
            <button className="btn-editar">Editar</button>
          </div>

          <div className="profile-info">
            <div className="profile-avatar">
              <div className="avatar">U</div>
              <div className="role-badge">
                <span>Mecánico</span>
                <span className="specialty">Especialista</span>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <h4>Nombre:</h4>
                <p>Carlos Javier Rodríguez</p>
              </div>
              <div className="detail-item">
                <h4>Email:</h4>
                <p>carlos.rodriguez@taller.com</p>
              </div>
              <div className="detail-item">
                <h4>Teléfono:</h4>
                <p>+34 612 345 678</p>
              </div>
              <div className="detail-item">
                <h4>Dirección:</h4>
                <p>Madrid, España</p>
              </div>

              <div className="specialties">
                <h4>Especialidades</h4>
                <div className="specialty-tags">
                  <span className="specialty-tag">Diagnóstico motor</span>
                  <span className="specialty-tag">Sistemas eléctricos</span>
                  <span className="specialty-tag">Mecánica general</span>
                </div>
              </div>

              <div className="account-security">
                <h4>Contraseña y autenticación</h4>
                <button className="btn-cambiar">Cambiar Contraseña</button>
              </div>

              <div className="account-actions">
                <h4>Remover cuenta</h4>
                <p className="warning-text">Desactivar tu cuenta significaría que la inhabilitarías por un tiempo</p>
                <div className="action-buttons">
                  <button className="btn-desactivar">Desactivar Cuenta</button>
                  <button className="btn-eliminar">Eliminar Cuenta</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="achievements-section">
          <h2>LOGROS DESTACADOS</h2>
          <div className="achievements-list">
            <div className="achievement-item">
              <i className="fas fa-trophy"></i>
              <div className="achievement-info">
                <h4>Mecánico del mes</h4>
                <p>Febrero 2024</p>
              </div>
            </div>
            <div className="achievement-item">
              <i className="fas fa-award"></i>
              <div className="achievement-info">
                <h4>100 Reparaciones Completadas</h4>
                <p>Diciembre 2023</p>
              </div>
            </div>
            <div className="achievement-item">
              <i className="fas fa-certificate"></i>
              <div className="achievement-info">
                <h4>Especialista Certificado</h4>
                <p>Noviembre 2023</p>
              </div>
            </div>
          </div>

          <div className="certifications">
            <h2>CERTIFICACIONES</h2>
            <div className="certification-items">
              <div className="certification-item">
                <div className="cert-info">
                  <h4>Certificado de Mecánica</h4>
                  <p>Válido hasta: 15/01/2026</p>
                </div>
                <span className="status-badge active">Activo</span>
              </div>
              <div className="certification-item">
                <div className="cert-info">
                  <h4>Certificado de Diagnóstico</h4>
                  <p>Válido hasta: 20/03/2025</p>
                </div>
                <span className="status-badge active">Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilMecanico;
