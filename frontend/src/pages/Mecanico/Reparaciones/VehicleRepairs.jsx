import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, ChevronLeft, ChevronRight, Check, ArrowLeft, ToolCase } from "lucide-react";
import "./VehicleRepairs.css";

const PLACEHOLDER_CAR =
  "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect fill='%23000' width='100%25' height='100%25'/><text x='50%25' y='50%25' font-size='18' fill='%23fff' alignment-baseline='middle' text-anchor='middle'>NO IMAGE</text></svg>";

// ------------------- RepairSelector -------------------
const RepairSelector = ({ repairs, activeIndex, setActiveIndex, onOpen }) => {
  const [query, setQuery] = useState("");
  const sliderRef = useRef(null);

  const visible = repairs.filter(
    (r) =>
      !query ||
      r.user.name.toLowerCase().includes(query.toLowerCase()) ||
      `${r.car.brand} ${r.car.model}`.toLowerCase().includes(query.toLowerCase())
  );

  const next = () => setActiveIndex((i) => (visible.length ? (i + 1) % visible.length : i));
  const prev = () => setActiveIndex((i) => (visible.length ? (i - 1 + visible.length) % visible.length : i));

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const cards = slider.querySelectorAll(".brand-card");
    const activeCard = cards[activeIndex];
    if (activeCard) {
      const scrollPos =
        activeCard.offsetLeft - slider.offsetWidth / 2 + activeCard.offsetWidth / 2;
      slider.scrollTo({ left: scrollPos, behavior: "smooth" });
    }
  }, [activeIndex, visible]);

  return (
    <div className="brand-selector">
      <header className="brand-header">
        <h1>REPARACIONES</h1>
        <div className="subtitle">SELECCIONA UNA REPARACIÓN</div>

        <div className="search-bar-nfs">
          <Search size={16} color="#fff" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            type="text"
            placeholder="BUSCAR POR USUARIO / AUTO..."
          />
        </div>
      </header>

      <div className="brand-slider-container">
        <button className="nfs-arrow prev" onClick={prev} aria-label="prev">
          <ChevronLeft size={32} />
        </button>

        <div className="brand-slider" ref={sliderRef}>
          {visible.map((repair, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={repair.id}
                className={`brand-card ${isActive ? "active" : ""}`}
                onClick={() => onOpen(idx)}
              >
                <div className="brand-logo-wrapper">
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.03)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      color: "var(--text-muted)",
                      fontWeight: 700,
                    }}
                  >
                    {repair.user.name
                      .split(" ")
                      .map((n) => (n ? n[0] : ""))
                      .slice(0, 2)
                      .join("")}
                  </div>
                </div>

                <div className="brand-info" style={{ marginTop: 8 }}>
                  <span className="brand-name">{repair.user.name.toUpperCase()}</span>
                  <div className="brand-bar" />
                  <div style={{ marginTop: 8, fontSize: 14, color: "var(--text-muted)" }}>
                    {repair.car.brand} {repair.car.model}
                  </div>
                </div>

                <img src={repair.car.image || PLACEHOLDER_CAR} alt="" className="brand-bg-car" />
              </div>
            );
          })}
        </div>

        <button className="nfs-arrow next" onClick={next} aria-label="next">
          <ChevronRight size={32} />
        </button>
      </div>

      <div className="footer-hint">
        <span className="key-hint">CLICK</span> PARA VER DETALLES
      </div>
    </div>
  );
};

// ------------------- RepairDetail -------------------
const RepairDetail = ({ repair, onClose, refreshRepairs }) => {
  const [status, setStatus] = useState(repair.status ?? 0);

  const markCompleted = async () => {
    try {
      await axios.patch(`/reparaciones/${repair.id}`, { status: 100, estado: "completed" });
      setStatus(100);
      refreshRepairs();
    } catch (err) {
      console.error(err);
    }
  };

  const takeRepair = async () => {
    try {
      await axios.patch(`/reparaciones/${repair.id}`, { estado: "in_progress" });
      refreshRepairs();
    } catch (err) {
      console.error(err);
    }
  };

  const addDiagnostic = () => alert(`Agregar diagnóstico para reparación ${repair.id}`);

  return (
    <div className="model-selector">
      <header className="model-header">
        <h1>{repair.car.brand} {repair.car.model}</h1>
        <span>{repair.user.name}</span>
      </header>

      <div className="main-stage">
        <div className="car-showcase">
          <img src={repair.car.image || PLACEHOLDER_CAR} alt="" />
          <div className="car-stats">
            <div>Vel: {repair.car.top_speed} km/h</div>
            <div>Acel: {repair.car.acceleration}s</div>
            <div>Man: {repair.car.handling}</div>
            <div>Estado: {status}%</div>
          </div>
        </div>
      </div>

      <footer className="model-footer">
        <button onClick={onClose}>ATRÁS</button>
        {status < 100 && <button onClick={takeRepair}>TOMAR REPARACIÓN</button>}
        {status < 100 && <button onClick={markCompleted}>MARCAR COMPLETADO</button>}
        <button onClick={addDiagnostic}>DIAGNÓSTICO</button>
      </footer>
    </div>
  );
};

// ------------------- VehicleRepairs (main) -------------------
const VehicleRepairs = ({ mecanicoId }) => {
  const [repairs, setRepairs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const inDetail = selectedIndex !== null;

  const fetchRepairs = async () => {
    try {
      const { data } = await axios.get(`/reparaciones?mecanico_id=${mecanicoId}&estado=pending`);
      setRepairs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const openDetail = (index) => setSelectedIndex(index);
  const closeDetail = () => setSelectedIndex(null);

  return (
    <div className="vehicle-selection-container">
      <div className={`screen-slider-wrapper ${inDetail ? "slide-left" : ""}`}>
        <div className="screen-pane">
          <RepairSelector
            repairs={repairs}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onOpen={openDetail}
          />
        </div>

        <div className="screen-pane">
          {inDetail ? (
            <RepairDetail
              repair={repairs[selectedIndex]}
              onClose={closeDetail}
              refreshRepairs={fetchRepairs}
            />
          ) : (
            <div style={{ padding: 28, color: "var(--text-muted)" }}>
              <h2>Selecciona una reparación para ver detalles</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleRepairs;
