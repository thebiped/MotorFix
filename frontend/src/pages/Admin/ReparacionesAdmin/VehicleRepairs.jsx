import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const PLACEHOLDER_CAR =
  "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect fill='%23000' width='100%25' height='100%25'/><text x='50%25' y='50%25' font-size='18' fill='%23fff' alignment-baseline='middle' text-anchor='middle'>NO IMAGE</text></svg>";
const PLACEHOLDER_AVATAR =
  "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><circle cx='40' cy='40' r='40' fill='%23333'/><text x='50%25' y='50%25' font-size='16' fill='%23fff' alignment-baseline='middle' text-anchor='middle'>NO</text></svg>";

/* -------------------------- Data example -------------------------- */
const exampleRepairs = [
  {
    id: 1,
    user: { name: "Juan Leto", avatar: PLACEHOLDER_AVATAR },
    car: {
      brand: "Nissan",
      model: "GT-R",
      image: PLACEHOLDER_CAR,
      top_speed: 315,
      acceleration: 3.2,
      handling: 90,
    },
  },
  {
    id: 2,
    user: { name: "Ana Pérez", avatar: PLACEHOLDER_AVATAR },
    car: {
      brand: "BMW",
      model: "M3",
      image: PLACEHOLDER_CAR,
      top_speed: 290,
      acceleration: 4.0,
      handling: 88,
    },
  },
  {
    id: 3,
    user: { name: "Carlos Gómez", avatar: PLACEHOLDER_AVATAR },
    car: {
      brand: "Audi",
      model: "RS7",
      image: PLACEHOLDER_CAR,
      top_speed: 305,
      acceleration: 3.5,
      handling: 85,
    },
  },
];

/* -------------------------- RepairSlider -------------------------- */
const RepairSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [anim, setAnim] = useState("idle");
  const sliderRef = useRef(null);
  const repairs = exampleRepairs;

  const next = () => {
    if (anim !== "idle") return;
    setAnim("exiting-left");
    setTimeout(() => {
      setActiveIndex((activeIndex + 1) % repairs.length);
      setAnim("entering-right");
      setTimeout(() => setAnim("idle"), 60);
    }, 300);
  };

  const prev = () => {
    if (anim !== "idle") return;
    setAnim("exiting-right");
    setTimeout(() => {
      setActiveIndex((activeIndex - 1 + repairs.length) % repairs.length);
      setAnim("entering-left");
      setTimeout(() => setAnim("idle"), 60);
    }, 300);
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
  }, [activeIndex]);

  return (
    <div className="brand-selector">
      <header className="brand-header">
        <h1>REPARACIONES</h1>
        <div className="subtitle">Selecciona una reparación</div>
      </header>

      <div className="brand-slider-container">
        <button className="nfs-arrow prev" onClick={prev}>
          <ChevronLeft size={32} />
        </button>

        <div className="brand-slider" ref={sliderRef}>
          {repairs.map((repair, idx) => {
            const isActive = idx === activeIndex;
            const car = repair.car;
            return (
              <div
                key={repair.id}
                className={`brand-card ${isActive ? "active" : ""}`}
              >
                <div className="brand-info">
                  <span className="brand-name">
                    Reparación {repair.id} - {repair.user.name}
                  </span>
                  <div className="brand-bar" />
                </div>

                <div className="brand-logo-wrapper">
                  <img
                    src={repair.user.avatar}
                    alt={repair.user.name}
                    className="brand-logo"
                  />
                </div>

                <img
                  src={car.image || PLACEHOLDER_CAR}
                  alt={`${car.brand} ${car.model}`}
                  className={`showcase-car ${isActive ? anim : ""}`}
                />

                <div className="car-stats">
                  <div className="stat-row">
                    <span className="label">VEL</span>
                    <div className="bar">
                      <div
                        className="fill"
                        style={{ width: `${Math.min(car.top_speed, 300) / 3}%` }}
                      />
                    </div>
                    <div className="stat-value">
                      {car.top_speed ? `${car.top_speed} km/h` : "--"}
                    </div>
                  </div>

                  <div className="stat-row">
                    <span className="label">ACEL</span>
                    <div className="bar">
                      <div
                        className="fill"
                        style={{
                          width: `${
                            car.acceleration
                              ? Math.max(0, Math.min(1, (7 - car.acceleration) / 7)) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <div className="stat-value">
                      {car.acceleration ? `${car.acceleration}s` : "--"}
                    </div>
                  </div>

                  <div className="stat-row">
                    <span className="label">MAN</span>
                    <div className="bar">
                      <div className="fill" style={{ width: `${car.handling || 0}%` }} />
                    </div>
                    <div className="stat-value">
                      {car.handling ? `${car.handling}/100` : "--"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="nfs-arrow next" onClick={next}>
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
};

/* -------------------------- Main Component -------------------------- */
const VehicleRepairs = () => {
  return (
    <div className="vehicle-selection-container">
      <RepairSlider />
    </div>
  );
};

export default VehicleRepairs;
