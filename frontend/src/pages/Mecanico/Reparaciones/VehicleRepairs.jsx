// VehicleRepairs.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowLeft,
  ToolCase,
} from "lucide-react";
import "./VehicleRepairs.css";

/* ---------------------- placeholders + sample data --------------------- */
const PLACEHOLDER_CAR =
  "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect fill='%23000' width='100%25' height='100%25'/><text x='50%25' y='50%25' font-size='18' fill='%23fff' alignment-baseline='middle' text-anchor='middle'>NO IMAGE</text></svg>";

const exampleRepairs = [
  {
    id: 1,
    user: { name: "Juan Leto", avatar: "" },
    car: {
      brand: "Nissan",
      model: "GT-R",
      image: PLACEHOLDER_CAR,
      top_speed: 315,
      acceleration: 3.2,
      handling: 90,
    },
    status: 50,
  },
  {
    id: 2,
    user: { name: "Ana Pérez", avatar: "" },
    car: {
      brand: "BMW",
      model: "M3",
      image: PLACEHOLDER_CAR,
      top_speed: 290,
      acceleration: 4.0,
      handling: 88,
    },
    status: 100,
  },
  {
    id: 3,
    user: { name: "Carlos Gómez", avatar: "" },
    car: {
      brand: "Audi",
      model: "RS7",
      image: PLACEHOLDER_CAR,
      top_speed: 305,
      acceleration: 3.5,
      handling: 85,
    },
    status: 0,
  },
];

/* -------------------------- RepairSelector ---------------------------- */
const RepairSelector = ({ repairs, activeIndex, setActiveIndex, onOpen }) => {
  const [query, setQuery] = useState("");
  const [loading] = useState(false);
  const sliderRef = useRef(null);

  const visible = repairs.filter(
    (r) =>
      !query ||
      r.user.name.toLowerCase().includes(query.toLowerCase()) ||
      `${r.car.brand} ${r.car.model}`.toLowerCase().includes(query.toLowerCase())
  );

  const next = () => {
    if (!visible.length) return;
    setActiveIndex((i) => (i + 1) % visible.length);
  };
  const prev = () => {
    if (!visible.length) return;
    setActiveIndex((i) => (i - 1 + visible.length) % visible.length);
  };

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

  if (loading) {
    return (
      <div className="brand-selector loading">
        <div className="brand-header">
          <h1>GARAJE</h1>
          <div className="subtitle">CARGANDO REPARACIONES...</div>
        </div>
      </div>
    );
  }

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
                onClick={() => {
                  const globalIndex = repairs.findIndex((r) => r.id === repair.id);
                  onOpen(globalIndex);
                }}
                onDoubleClick={() => {
                  const globalIndex = repairs.findIndex((r) => r.id === repair.id);
                  onOpen(globalIndex);
                }}
                role="button"
                tabIndex={0}
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

/* --------------------------- RepairDetail ---------------------------- */
const RepairDetail = ({ repairs, index: startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex || 0);
  const [anim, setAnim] = useState("idle");
  const [statusMap, setStatusMap] = useState(() =>
    repairs.reduce((acc, r) => {
      acc[r.id] = r.status ?? 0;
      return acc;
    }, {})
  );

  useEffect(() => {
    setIndex(startIndex || 0);
  }, [startIndex]);

  const current = repairs[index];

  const changeSlide = (direction) => {
    if (anim !== "idle" || repairs.length <= 1) return;
    const exit = direction === "next" ? "exiting-left" : "exiting-right";
    const enter = direction === "next" ? "entering-right" : "entering-left";
    setAnim(exit);
    setTimeout(() => {
      const newIndex =
        direction === "next"
          ? (index + 1) % repairs.length
          : (index - 1 + repairs.length) % repairs.length;
      setIndex(newIndex);
      setAnim(enter);
      setTimeout(() => setAnim("idle"), 180);
    }, 260);
  };

  const markCompleted = (id) => setStatusMap((s) => ({ ...s, [id]: 100 }));
  const addDiagnostic = (id) => alert(`Agregar diagnóstico para reparación ${id} (${current.user.name})`);

  return (
    <div className="model-selector">
      <div className="model-background-grid" />

      <header className="model-header">
        <div className="brand-badge">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                background: "rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
              }}
            >
              {current.user.name
                .split(" ")
                .map((n) => (n ? n[0] : ""))
                .slice(0, 2)
                .join("")}
            </div>
            <span>{current.user.name.toUpperCase()}</span>
          </div>
        </div>

        <div className="model-title-wrapper">
          <h1 className={`model-name-title ${anim.includes("exiting") ? "fade-out" : "fade-in"}`}>
            {current.car.brand} {current.car.model}
          </h1>
        </div>
      </header>

      <div className="main-stage">
        <button className="nfs-nav-btn left" onClick={() => changeSlide("prev")}>
          <ChevronLeft size={40} />
        </button>

        <div className="car-showcase" style={{ width: "min(900px,60%)" }}>
          <div className="turntable">
            <img
              src={current.car.image || PLACEHOLDER_CAR}
              alt={`${current.car.brand} ${current.car.model}`}
              className={`showcase-car ${anim}`}
              style={{ maxHeight: 360 }}
            />
            <div className="car-shadow" />
          </div>

          <div className="car-stats">
            <div className="stat-row">
              <span className="label">VEL</span>
              <div className="bar">
                <div className="fill" style={{ width: `${Math.min(current.car.top_speed || 0, 300) / 3}%` }} />
              </div>
              <div className="stat-value">{current.car.top_speed ? `${current.car.top_speed} km/h` : "--"}</div>
            </div>

            <div className="stat-row">
              <span className="label">ACEL</span>
              <div className="bar">
                <div
                  className="fill"
                  style={{
                    width: `${
                      current.car.acceleration
                        ? Math.max(0, Math.min(1, (7 - current.car.acceleration) / 7)) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="stat-value">{current.car.acceleration ? `${current.car.acceleration}s` : "--"}</div>
            </div>

            <div className="stat-row">
              <span className="label">MAN</span>
              <div className="bar">
                <div className="fill" style={{ width: `${current.car.handling || 0}%` }} />
              </div>
              <div className="stat-value">{current.car.handling ? `${current.car.handling}/100` : "--"}</div>
            </div>

            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Estado</div>
              <div style={{ flex: 1, height: 10, background: "#232323", borderRadius: 6, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${statusMap[current.id] ?? 0}%`,
                    background: "linear-gradient(90deg,var(--accent),var(--accent-2))",
                    transition: "width 0.48s cubic-bezier(0.2,0.9,0.3,1)",
                  }}
                />
              </div>
              <div style={{ minWidth: 52, textAlign: "right", fontWeight: 800 }}>{statusMap[current.id] ?? 0}%</div>
            </div>
          </div>
        </div>

        <button className="nfs-nav-btn right" onClick={() => changeSlide("next")}>
          <ChevronRight size={40} />
        </button>
      </div>

      <footer className="model-footer">
        <div className="footer-actions">
          <button className="nfs-btn secondary" onClick={onClose}>
            <ArrowLeft size={18} /> ATRÁS
          </button>

          <button className="nfs-btn primary" onClick={() => addDiagnostic(current.id)}>
            <ToolCase size={18} /> DIAGNÓSTICO
          </button>

          <button
            className="nfs-btn primary"
            onClick={() => markCompleted(current.id)}
            disabled={(statusMap[current.id] ?? 0) === 100}
          >
            <Check size={18} /> {(statusMap[current.id] ?? 0) === 100 ? "COMPLETADO" : "MARCAR COMPLETADO"}
          </button>
        </div>
      </footer>
    </div>
  );
};

/* --------------------------- Main Component ---------------------------- */
const VehicleRepairs = () => {
  const [repairs] = useState(exampleRepairs);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const inDetail = selectedIndex !== null;

  const openDetail = (index) => {
    setActiveIndex(index);
    setSelectedIndex(index);
  };

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
            <RepairDetail repairs={repairs} index={selectedIndex} onClose={closeDetail} />
          ) : (
            <div style={{ padding: 28, color: "var(--text-muted)" }}>
              <h2 style={{ marginTop: 12 }}>Selecciona una reparación para ver detalles</h2>
              <p style={{ maxWidth: 560, color: "var(--text-muted)" }}>
                Haz click sobre una tarjeta en la izquierda para abrir el detalle con animaciones estilo Arkham/NFS.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleRepairs;
