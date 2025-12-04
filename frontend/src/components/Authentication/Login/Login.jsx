import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import api from "../../../services/api";
import bg_login from "../../../assets/img/bg_login.png";
import logo from "../../../assets/img/logo.png";
import WelcomeLoader from "../../Welcome/WelcomeLoader";
import "./Login.css";

/* Timings cinematográficos */
const TEXT_ROTATE_INTERVAL = 3600;
const LOADING_DURATION = 5200;
const FINAL_HOLD = 2600;
const ERROR_HOLD = 3600;
const SUCCESS_HOLD = 2600; // tiempo que se queda el mensaje verde de éxito

/* Textos estilo Arkham */
const texts = [
  "Inicializando protocolos…",
  "Autenticando usuario…",
  "Sincronizando módulo de entrada…",
];

function Login() {
  const navigate = useNavigate();

  /* Campos formulario */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  /* Loader HUD */
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  /* Textos */
  const [rotTextIndex, setRotTextIndex] = useState(0);
  const rotRef = useRef(null);

  /* Resultado API */
  const [loginResult, setLoginResult] = useState(null);

  /* Mensajes */
  const [loaderMessage, setLoaderMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* Welcome */
  const [showWelcome, setShowWelcome] = useState(false);

  /* Autocompletar */
  useEffect(() => {
    const saved = localStorage.getItem("rememberedUsername");
    if (saved) {
      setUsername(saved);
      setRememberMe(true);
    }

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
      if (rotRef.current) clearInterval(rotRef.current);
    };
  }, []);

  /* ROTACIÓN DE TEXTOS */
  const startRotatingTexts = () => {
    if (rotRef.current) clearInterval(rotRef.current);

    setRotTextIndex(0);

    rotRef.current = setInterval(() => {
      setRotTextIndex((prev) => (prev + 1) % texts.length);
    }, TEXT_ROTATE_INTERVAL);
  };

  const stopRotatingTexts = () => {
    if (rotRef.current) {
      clearInterval(rotRef.current);
      rotRef.current = null;
    }
  };

  /* BARRA DE PROGRESO LENTA */
  const startProgress = () => {
    const fps = 30;
    const steps = Math.max(1, Math.floor((LOADING_DURATION / 1000) * fps));
    const increment = Math.ceil(100 / steps);

    let current = 0;
    setProgress(0);

    if (progressRef.current) clearInterval(progressRef.current);

    progressRef.current = setInterval(() => {
      current = Math.min(100, current + increment);
      setProgress(current);

      if (current >= 100) {
        clearInterval(progressRef.current);
        progressRef.current = null;
      }
    }, Math.floor(LOADING_DURATION / steps));
  };

  /* SINCRONIZACIÓN TOTAL DEL HUD */
  useEffect(() => {
    if (!loading) {
      stopRotatingTexts();
      setLoaderMessage("");
      setErrorMessage("");
      setSuccessMessage("");
      return;
    }

    /* --- TEXTOS SEGÚN PROGRESO --- */
    let dynamicMessage = texts[rotTextIndex];

    if (progress >= 30 && progress < 70) {
      dynamicMessage = "Analizando integridad del sistema…";
    } else if (progress >= 70 && progress < 100) {
      dynamicMessage = "Armando enlace seguro…";
    } else if (progress >= 100 && loginResult == null) {
      dynamicMessage = "Finalizando proceso…";
    }

    /* No mostrar mensaje si la barra ya terminó */
    if (progress >= 100) {
      dynamicMessage = "";
    }

    setLoaderMessage(dynamicMessage);

    /* --- ÉXITO: APARECE MENSAJE HUD VERDE --- */
    if (progress >= 100 && loginResult === "success") {
      stopRotatingTexts();

      setLoaderMessage("ACCESO CONCEDIDO — Bienvenido al sistema.");

      setTimeout(() => {
        setSuccessMessage("");
        setLoading(false);
        setShowWelcome(true);
      }, SUCCESS_HOLD);
    }

    /* --- ERROR: REPENTINO --- */
    if (progress >= 100 && typeof loginResult === "object") {
      stopRotatingTexts();

      setTimeout(() => {
        setErrorMessage(loginResult.error);
      }, 150);

      setTimeout(() => {
        setLoading(false);
        setLoginResult(null);
      }, ERROR_HOLD);
    }
  }, [loading, rotTextIndex, progress, loginResult]);

  /* ERROR INSTANTÁNEO */
  const showImmediateLoaderError = (msg) => {
    setErrorMessage("");
    setLoginResult({ error: msg });
    setLoading(true);
    startProgress();
  };

  /* SUBMIT */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showImmediateLoaderError("Debes completar todos los campos.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setLoginResult(null);

    startRotatingTexts();
    startProgress();
    setLoaderMessage(texts[0]);

    try {
      const res = await api.post("/auth/login", { username, password });

      if (res.data?.success) {
        localStorage.setItem("token", res.data.token);
        api.defaults.headers.common["Authorization"] =
          `Bearer ${res.data.token}`;

        localStorage.setItem("user", JSON.stringify(res.data.user));

        if (rememberMe)
          localStorage.setItem("rememberedUsername", username);
        else localStorage.removeItem("rememberedUsername");

        setLoginResult("success");
      } else {
        setLoginResult({
          error: res.data?.message || "Credenciales incorrectas.",
        });
      }
    } catch (err) {
      setLoginResult({
        error: err.response?.data?.message || "Error de servidor.",
      });
    }
  };

  /* MOSTRAR WELCOME */
  if (showWelcome) {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      <WelcomeLoader
        name={user?.username || "Usuario"}
        onFinish={() => {
          const rol = user?.rol;
          if (rol === "admin") navigate("/admin/dashboard");
          else if (rol === "mecanico") navigate("/mecanico/dashboard");
          else navigate("/cliente/dashboard");
        }}
      />
    );
  }

  return (
    <>
      {loading && (
        <div className="initial-loader-overlay" role="status">
          <div className="initial-loader-content arkham">

            {/* TEXTO PRINCIPAL */}
            {loaderMessage && (
              <div className="glitch-title" data-text={loaderMessage}>
                {loaderMessage}
              </div>
            )}

            {/* MENSAJE DE ÉXITO (VERDE HUD) */}
            {successMessage && (
              <div className="hud-success-message glitch-title" data-text={successMessage}>
                {successMessage}
              </div>
            )}

            {/* MENSAJE DE ERROR (ROJO ALERT) */}
            {errorMessage && (
              <div className="hud-error-message glitch-title" >
                ERROR: {errorMessage}
              </div>
            )}

            {/* BARRA */}
            <div className="loader-bar">
              <div
                className="loader-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* FORM LOGIN */}
      <div className="login-container">
        <div className="login">
          <div className="login-logo">
            <img src={logo} alt="Logo" />
            <h2 className="login-title">Inicio de sesión</h2>
          </div>

          <form className="login-form-container" onSubmit={handleLogin}>
            <div className="login-group">
              <label>Username</label>
              <div className="login-input-box">
                <FaRegUser size={20} />
                <input
                  type="text"
                  placeholder="Tu usuario..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="login-group">
              <label>Password</label>
              <div className="login-input-box">
                <CiLock size={20} />
                <input
                  type="password"
                  placeholder="Tu contraseña..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Recordarme
              </label>

              <Link to="/forgot-password" className="forgot-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div className="login-button">
              <button className="login-btn" type="submit">
                Iniciar sesión
              </button>
            </div>
          </form>

          <p className="register-text">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="register-link">
              Registrarse
            </Link>
          </p>
        </div>

        <div className="login-bg">
          <div className="overlay" />
          <img src={bg_login} alt="Car background" />
        </div>
      </div>
    </>
  );
}

export default Login;
