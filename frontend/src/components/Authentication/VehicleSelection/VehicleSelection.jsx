import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowLeft,
} from "lucide-react";
import { getBrands, getModelsByBrand } from "../../../services/vehicleService";
import "./vehicleSelection.css";

const PLACEHOLDER_LOGO =
  "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='60'><rect fill='%23222' width='100%25' height='100%25'/><text x='50%25' y='50%25' font-size='14' fill='%23fff' alignment-baseline='middle' text-anchor='middle'>NO LOGO</text></svg>";
const PLACEHOLDER_CAR =
  "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect fill='%23000' width='100%25' height='100%25'/><text x='50%25' y='50%25' font-size='18' fill='%23fff' alignment-baseline='middle' text-anchor='middle'>NO IMAGE</text></svg>";

/* -------------------------- BrandSelector -------------------------- */
const BrandSelector = ({ onBrandSelect }) => {
  const [brands, setBrands] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getBrands()
      .then((data) => {
        if (!mounted) return;
        setBrands(data || []);
        setActiveIndex(0);
      })
      .catch((err) => {
        console.error("Error fetching brands", err);
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  // Center active card
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const cards = slider.querySelectorAll(".brand-card");
    const activeCard = cards[activeIndex];
    if (activeCard) {
      const scrollPos =
        activeCard.offsetLeft -
        slider.offsetWidth / 2 +
        activeCard.offsetWidth / 2;
      slider.scrollTo({ left: scrollPos, behavior: "smooth" });
    }
  }, [activeIndex, brands]);

  const visible = brands.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  const next = () => {
    if (visible.length === 0) return;
    setActiveIndex((i) => (i + 1) % visible.length);
  };
  const prev = () => {
    if (visible.length === 0) return;
    setActiveIndex((i) => (i - 1 + visible.length) % visible.length);
  };

  if (loading) {
    return (
      <div className="brand-selector loading">
        <div className="brand-header">
          <h1>GARAJE</h1>
          <div className="subtitle">CARGANDO MARCAS...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-selector">
      <header className="brand-header">
        <h1>GARAJE</h1>
        <div className="subtitle">SELECCIONA UNA MARCA</div>

        <div className="search-bar-nfs">
          <Search size={16} color="#fff" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="BUSCAR MARCA..."
          />
        </div>
      </header>

      <div className="brand-slider-container">
        <button className="nfs-arrow prev" onClick={prev} aria-label="prev">
          <ChevronLeft size={32} />
        </button>

        <div className="brand-slider" ref={sliderRef}>
          {visible.map((brand, idx) => {
            // compute index in original array to preserve selection behavior if needed
            const globalIndex = brands.findIndex(
              (b) => b.id_brand === brand.id_brand
            );
            const isActive = idx === activeIndex;
            return (
              <div
                key={brand.id_brand}
                className={`brand-card ${isActive ? "active" : ""}`}
                onClick={() => setActiveIndex(idx)}
                onDoubleClick={() => onBrandSelect(brand)}
                role="button"
                tabIndex={0}
              >
                <div className="brand-logo-wrapper">
                  <img
                    src={brand.logo_url || PLACEHOLDER_LOGO}
                    alt={brand.name}
                    className="brand-logo"
                  />
                </div>

                <div className="brand-info">
                  <span className="brand-name">{brand.name.toUpperCase()}</span>
                  <div className="brand-bar" />
                </div>

                <img
                  src={brand.example_car_url || PLACEHOLDER_CAR}
                  alt=""
                  className="brand-bg-car"
                />
              </div>
            );
          })}
        </div>

        <button className="nfs-arrow next" onClick={next} aria-label="next">
          <ChevronRight size={32} />
        </button>
      </div>

      <div className="footer-hint">
        <span className="key-hint">DOBLE CLIC</span> PARA SELECCIONAR
      </div>
    </div>
  );
};

/* -------------------------- ModelSelector -------------------------- */
const ModelSelector = ({ brand, onBack, onVehicleSelect }) => {
  const [models, setModels] = useState([]);
  const [index, setIndex] = useState(0);
  const [anim, setAnim] = useState("idle");
  const [loading, setLoading] = useState(true);
  const brandId = brand?.id_brand;
  const [selectedColor, setSelectedColor] = useState("white");
  const [plate, setPlate] = useState("");

  useEffect(() => {
    if (!brandId) return;
    let mounted = true;
    setLoading(true);
    getModelsByBrand(brandId)
      .then((data) => {
        if (!mounted) return;
        setModels(data || []);
        setIndex(0);
      })
      .catch((err) => console.error("Error loading models", err))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [brandId]);

  const changeSlide = (direction) => {
    if (anim !== "idle" || models.length <= 1) return;
    const exit = direction === "next" ? "exiting-left" : "exiting-right";
    const enter = direction === "next" ? "entering-right" : "entering-left";
    setAnim(exit);
    setTimeout(() => {
      const newIndex =
        direction === "next"
          ? (index + 1) % models.length
          : (index - 1 + models.length) % models.length;
      setIndex(newIndex);
      setAnim(enter);
      setTimeout(() => setAnim("idle"), 60);
    }, 300);
  };

  if (loading) {
    return (
      <div className="model-selector empty">
        <h2>Cargando modelos...</h2>
        <button onClick={onBack} className="nfs-btn secondary">
          <ArrowLeft size={18} /> ATRÁS
        </button>
      </div>
    );
  }

  if (!models.length) {
    return (
      <div className="model-selector empty">
        <h2>Sin modelos disponibles</h2>
        <button onClick={onBack} className="nfs-btn secondary">
          <ArrowLeft size={18} /> ATRÁS
        </button>
      </div>
    );
  }

  const current = models[index];

  return (
    <div className="model-selector">
      <div className="model-background-grid" />

      <header className="model-header">
        <div className="brand-badge">
          <img
            src={brand.logo_url || PLACEHOLDER_LOGO}
            alt={`${brand.name} logo`}
          />
          <span>{brand.name.toUpperCase()}</span>
        </div>

        <div className="model-title-wrapper">
          <h1
            className={`model-name-title ${
              anim.includes("exiting") ? "fade-out" : "fade-in"
            }`}
          >
            {current.name}
          </h1>
        </div>
      </header>

      <div className="main-stage">
        <button
          className="nfs-nav-btn left"
          onClick={() => changeSlide("prev")}
        >
          <ChevronLeft size={40} />
        </button>

        <div className="car-showcase">
          <div className="turntable">
            <img
              src={current.image_url || PLACEHOLDER_CAR}
              alt={current.name}
              className={`showcase-car ${anim}`}
            />
            <div className="car-shadow" />
          </div>

          <div className="car-stats">
            <div className="stat-row">
              <span className="label">VEL</span>
              <div className="bar">
                <div
                  className="fill"
                  style={{
                    width: `${Math.min(current.top_speed || 0, 300) / 3}%`,
                  }}
                />
              </div>
              <div className="stat-value">
                {current.top_speed ? `${current.top_speed} km/h` : "--"}
              </div>
            </div>

            <div className="stat-row">
              <span className="label">ACEL</span>
              <div className="bar">
                {/* acceleration is seconds 0-100; smaller = better so we invert to % */}
                <div
                  className="fill"
                  style={{
                    width: `${
                      current.acceleration
                        ? Math.max(
                            0,
                            Math.min(1, (7 - current.acceleration) / 7)
                          ) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="stat-value">
                {current.acceleration ? `${current.acceleration}s` : "--"}
              </div>
            </div>

            <div className="stat-row">
              <span className="label">MAN</span>
              <div className="bar">
                <div
                  className="fill"
                  style={{ width: `${current.handling || 0}%` }}
                />
              </div>
              <div className="stat-value">
                {current.handling ? `${current.handling}/100` : "--"}
              </div>
            </div>
          </div>
        </div>

        <button
          className="nfs-nav-btn right"
          onClick={() => changeSlide("next")}
        >
          <ChevronRight size={40} />
        </button>
      </div>

      <footer className="model-footer">
        <div className="config-panel">
          <div className="config-group">
            <label>COLOR</label>
            <div className="color-picker">
              {["white", "black", "red", "blue"].map((c) => (
                <div
                  key={c}
                  className={`color-dot ${c} ${
                    selectedColor === c ? "active" : ""
                  }`}
                  onClick={() => setSelectedColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="config-group">
            <label>MATRÍCULA</label>
            <input
              type="text"
              placeholder="Ej: NFS-2024"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
            />
          </div>
        </div>

        <div className="footer-actions">
          <button className="nfs-btn secondary" onClick={onBack}>
            <ArrowLeft size={18} /> ATRÁS
          </button>

          <button
            className="nfs-btn primary"
            onClick={() => {
              if (!plate) return alert("Ingresa una matrícula");
              onVehicleSelect({
                brand_id: brand.id_brand,
                model_id: current.id_model,
                color: selectedColor,
                plate,
              });
            }}
          >
            SELECCIONAR <Check size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
};

/* -------------------------- Main Component -------------------------- */
const VehicleSelection = ({ onVehicleSelect }) => {
  const [selectedBrand, setSelectedBrand] = useState(null);

  return (
    <div className="vehicle-selection-container">
      <div
        className={`screen-slider-wrapper ${selectedBrand ? "slide-left" : ""}`}
      >
        <div className="screen-pane">
          <BrandSelector onBrandSelect={(b) => setSelectedBrand(b)} />
        </div>

        <div className="screen-pane">
          {selectedBrand && (
            <ModelSelector
              brand={selectedBrand}
              onBack={() => setSelectedBrand(null)}
              onVehicleSelect={onVehicleSelect} // <--- PASAR la prop
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleSelection;
