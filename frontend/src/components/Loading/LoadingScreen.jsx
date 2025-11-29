// LoadingScreen.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const LoadingScreen = () => {
  /* ---------------- HUD Arkham Loader reutilizado del Login ---------------- */

  const TEXT_ROTATE_INTERVAL = 3600;
  const LOADING_DURATION = 5200;
  const SUCCESS_HOLD = 2600;

  const texts = [
    "Inicializando protocolos…",
    "Autenticando usuario…",
    "Sincronizando módulo de entrada…",
  ];

  const [loadingHUD, setLoadingHUD] = useState(true); // arranca activo
  const [progressHUD, setProgressHUD] = useState(0);
  const [loaderMessageHUD, setLoaderMessageHUD] = useState("");
  const [successHUD, setSuccessHUD] = useState("");
  const [errorHUD, setErrorHUD] = useState("");
  const [rotTextIndexHUD, setRotTextIndexHUD] = useState(0);

  const rotRefHUD = useRef(null);
  const progRefHUD = useRef(null);

  const navigate = useNavigate();

  /* Rotación de textos */
  const startRotatingHUD = () => {
    if (rotRefHUD.current) clearInterval(rotRefHUD.current);

    setRotTextIndexHUD(0);

    rotRefHUD.current = setInterval(() => {
      setRotTextIndexHUD((p) => (p + 1) % texts.length);
    }, TEXT_ROTATE_INTERVAL);
  };

  const stopRotatingHUD = () => {
    if (rotRefHUD.current) {
      clearInterval(rotRefHUD.current);
      rotRefHUD.current = null;
    }
  };

  /* Barra progreso cinematográfica */
  const startHUDProgress = () => {
    const fps = 30;
    const steps = Math.floor((LOADING_DURATION / 1000) * fps);
    const increment = Math.ceil(100 / steps);

    let current = 0;
    setProgressHUD(0);

    if (progRefHUD.current) clearInterval(progRefHUD.current);

    progRefHUD.current = setInterval(() => {
      current = Math.min(100, current + increment);
      setProgressHUD(current);

      if (current >= 100) {
        clearInterval(progRefHUD.current);
        progRefHUD.current = null;

        // ÉXITO → navegar
        setSuccessHUD("ACCESO CONCEDIDO — Redirigiendo…");
        setTimeout(() => navigate("/"), SUCCESS_HOLD);
      }
    }, Math.floor(LOADING_DURATION / steps));
  };

  /* Sincronización HUD */
  useEffect(() => {
    if (!loadingHUD) {
      stopRotatingHUD();
      return;
    }

    let msg = texts[rotTextIndexHUD];

    if (progressHUD >= 30 && progressHUD < 70)
      msg = "Analizando integridad del sistema…";

    if (progressHUD >= 70 && progressHUD < 100) msg = "Armando enlace seguro…";

    if (progressHUD >= 100) msg = "";

    setLoaderMessageHUD(msg);
  }, [loadingHUD, rotTextIndexHUD, progressHUD]);

  /* Iniciar HUD automáticamente */
  useEffect(() => {
    startRotatingHUD();
    startHUDProgress();

    return () => {
      stopRotatingHUD();
      if (progRefHUD.current) clearInterval(progRefHUD.current);
    };
  }, []);

  return (
    <>
      {loadingHUD && (
        <div className="initial-loader-overlay" role="status">
          <div className="initial-loader-content arkham">

            {/* Texto animado */}
            {loaderMessageHUD && (
              <div className="glitch-title" data-text={loaderMessageHUD}>
                {loaderMessageHUD}
              </div>
            )}

            {/* Mensaje éxito */}
            {successHUD && (
              <div className="hud-success-message">
                {successHUD}
              </div>
            )}

            {/* Error */}
            {errorHUD && (
              <div className="hud-error-message">
                ERROR: {errorHUD}
              </div>
            )}

            {/* Barra */}
            <div className="loader-bar">
              <div
                className="loader-bar-fill"
                style={{ width: `${progressHUD}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingScreen;
