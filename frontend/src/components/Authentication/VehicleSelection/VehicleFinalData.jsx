import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./vehicleFinalData.css";

const SAVE_DURATION = 2600;

const VehicleFinalData = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  // Inputs
  const [form, setForm] = useState({
    patente: "",
    kilometraje: "",
    serviceInterval: "",
    color: "",
  });

  const REQUIRED = ["patente", "kilometraje", "serviceInterval", "color"];

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const progressRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // ============================================================
  // 1. Cargar marca + modelo desde localStorage
  // ============================================================
  useEffect(() => {
    const stored = localStorage.getItem("vehicle_selection");

    if (!stored) {
      alert("No se seleccionó ningún vehículo.");
      return navigate("/vehicle-selection");
    }

    const parsed = JSON.parse(stored);
    console.log("DEBUG vehicle_selection:", parsed);

    setData(parsed);
  }, []);

  // Si faltan datos del vehículo, mostrar mensaje
  if (!data || !data.brand || !data.model) {
    return (
      <div className="vehicle-final-error">
        <h2>Error: Datos incompletos</h2>
        <p>No se pudo cargar la información del vehículo seleccionado.</p>
        <button onClick={() => navigate("/vehicle-selection")}>
          Volver a seleccionar
        </button>
      </div>
    );
  }

  const { brand, model } = data;

  // ============================================================
  // Validar y enviar
  // ============================================================
  const handleSubmit = () => {
    for (let key of REQUIRED) {
      if (!form[key]) {
        setError("⚠️ Debes completar todos los campos.");
        return;
      }
    }
    setError("");
    startSaving();
  };

  // HUD + progress bar
  const startSaving = () => {
    setLoading(true);
    let current = 0;

    progressRef.current = setInterval(() => {
      current += 3.4;
      if (current >= 100) {
        current = 100;
        clearInterval(progressRef.current);
      }
      setProgress(current);
    }, 80);

    // Enviar al backend mientras animamos
    saveVehicle();
  };

  // Guardar vehículo con el nuevo flujo
  const saveVehicle = () => {
    const storedUserId = localStorage.getItem("temp_user_id");
    const user_id = storedUserId ? parseInt(storedUserId, 10) : 1;

    fetch("http://localhost:3001/api/vehiculos/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        id_brand: brand.id_brand,
        id_model: model.id_model,
        patente: form.patente,
        mileage: form.kilometraje,
        service_interval: form.serviceInterval,
        color: form.color,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setTimeout(() => {
          if (res.success) {
            console.log("Vehículo guardado correctamente", res);
            navigate("/");
          } else {
            alert("Error guardando vehículo: " + res.error);
            setLoading(false);
          }
        }, SAVE_DURATION);
      })
      .catch((err) => {
        console.error(err);
        alert("Error al conectar con el servidor.");
        setLoading(false);
      });
  };

  // ============================================================
  //  HTML (estructura con botones movidos)
  // ============================================================
  return (
    <div className="final-container">
      {/* OVERLAY HUD */}
      {loading && (
        <div className="final-loader-overlay">
          <div className="final-loader-box">
            <div className="final-loader-title">
              PROCESANDO DATOS DEL VEHÍCULO…
            </div>

            <div className="final-loader-bar">
              <div
                className="final-loader-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="final-loader-sub">Espere un momento…</div>
          </div>
        </div>
      )}

      <div className="final-wrapper-border">
        {/* PANEL IZQUIERDO — Inputs */}
        <div className="final-left-panel">
          <h2 className="final-title">ÚLTIMOS DATOS</h2>

          <p className="final-brand-line">
            <strong>Marca:</strong> {brand.name}
          </p>
          <p className="final-brand-line">
            <strong>Modelo:</strong> {model.name}
          </p>

          <div className="final-group">
            <label>PATENTE</label>
            <input
              type="text"
              placeholder="Ej: ABC123"
              onChange={(e) =>
                setForm({ ...form, patente: e.target.value.toUpperCase() })
              }
            />
          </div>

          <div className="final-group">
            <label>KILOMETRAJE</label>
            <input
              type="number"
              placeholder="Ej: 154000"
              onChange={(e) =>
                setForm({ ...form, kilometraje: e.target.value })
              }
            />
          </div>

          <div className="final-group">
            <label>SERVICE INTERVALO</label>
            <input
              type="number"
              placeholder="Ej: 10000"
              onChange={(e) =>
                setForm({ ...form, serviceInterval: e.target.value })
              }
            />
          </div>

          <div className="final-group">
            <label>COLOR</label>
            <div className="final-color-picker">
              {["white", "black", "red", "blue", "gray"].map((c) => (
                <div
                  key={c}
                  className={`final-color-dot ${c} ${
                    form.color === c ? "active" : ""
                  }`}
                  onClick={() => setForm({ ...form, color: c })}
                />
              ))}
            </div>
          </div>

          {error && <div className="final-error">{error}</div>}
        </div>

        {/* PANEL DERECHO — Imagen + Botones */}
        <div className="final-right-panel">
          <div className="final-car-box">
            <img
              src={model.image_url || "/img/default-car.png"}
              alt="Vehículo Seleccionado"
              className="final-car-img"
            />
          </div>

          {/* ACCIONES MOVILIZADAS AQUÍ */}
          <div className="final-actions in-panel">
            <button className="final-btn secondary" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} /> ATRÁS
            </button>

            <button className="final-btn primary" onClick={handleSubmit}>
              SELECCIONAR <Check size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Se eliminó el footer final */}
    </div>
  );
};

export default VehicleFinalData;