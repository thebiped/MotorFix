import React from 'react';
import './HorarioMecanico.css';

const HorarioMecanico = () => {
  return (
    <div className="horario-container">
      <div className="calendar-section">
        <h2 className="month-title">MARZO DE 2024</h2>
        <div className="calendar">
          <div className="calendar-header">
            <div>Dom</div>
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
          </div>
          <div className="calendar-grid">
            {/* Week 1 */}
            <div className="calendar-day empty"></div>
            <div className="calendar-day empty"></div>
            <div className="calendar-day empty"></div>
            <div className="calendar-day empty"></div>
            <div className="calendar-day empty"></div>
            <div className="calendar-day">1</div>
            <div className="calendar-day">2</div>

            {/* Week 2 */}
            <div className="calendar-day">3</div>
            <div className="calendar-day has-task">
              4
              <span className="task-time">08:00</span>
            </div>
            <div className="calendar-day">5</div>
            <div className="calendar-day">6</div>
            <div className="calendar-day">7</div>
            <div className="calendar-day">8</div>
            <div className="calendar-day">9</div>

            {/* Week 3 */}
            <div className="calendar-day">10</div>
            <div className="calendar-day has-task">
              11
              <span className="task-time">14:00</span>
            </div>
            <div className="calendar-day">12</div>
            <div className="calendar-day">13</div>
            <div className="calendar-day has-task">
              14
              <span className="task-time">10:30</span>
            </div>
            <div className="calendar-day has-task">
              15
              <span className="task-time">16:00</span>
            </div>
            <div className="calendar-day">16</div>

            {/* Week 4 */}
            <div className="calendar-day">17</div>
            <div className="calendar-day">18</div>
            <div className="calendar-day">19</div>
            <div className="calendar-day">20</div>
            <div className="calendar-day">21</div>
            <div className="calendar-day">22</div>
            <div className="calendar-day">23</div>

            {/* Week 5 */}
            <div className="calendar-day">24</div>
            <div className="calendar-day">25</div>
            <div className="calendar-day">26</div>
            <div className="calendar-day">27</div>
            <div className="calendar-day">28</div>
            <div className="calendar-day">29</div>
            <div className="calendar-day">30</div>
          </div>
        </div>
      </div>

      <div className="sidebar">
        <div className="task-counters">
          <div className="counter-card">
            <h3>Total de tareas</h3>
            <span className="number">1</span>
          </div>
          <div className="counter-card">
            <h3>Completadas</h3>
            <span className="number">1</span>
          </div>
          <div className="counter-card">
            <h3>En progreso</h3>
            <span className="number">1</span>
          </div>
        </div>

        <div className="daily-agenda">
          <h3>AGENDA DE HOY</h3>
          <p className="current-date">Jueves 14/10/2024</p>
          
          <div className="agenda-items">
            <div className="agenda-item">
              <span className="time">08:00</span>
              <div className="task-info">
                <h4>Cambio de aceite - Ford Focus</h4>
                <p>Cliente: Juan Pérez</p>
              </div>
            </div>

            <div className="agenda-item">
              <span className="time">10:30</span>
              <div className="task-info">
                <h4>Revisión de frenos - Toyota Corolla</h4>
                <p>Cliente: María López</p>
              </div>
            </div>

            <div className="agenda-item">
              <span className="time">14:00</span>
              <div className="task-info">
                <h4>Diagnóstico motor - Volkswagen Gol</h4>
                <p>Cliente: Ana García</p>
              </div>
            </div>

            <div className="agenda-item">
              <span className="time">16:00</span>
              <div className="task-info">
                <h4>Cambio de batería - Fiat Palio</h4>
                <p>Cliente: Roberto Silva</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorarioMecanico;
