import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import api from "../../../services/api";
import bg_login from "../../../assets/img/bg_login.png";
import logo from "../../../assets/img/logo.png";
import ToastNotification from "../../notification/ToastNotification";
import WelcomeLoader from "../../Welcome/WelcomeLoader";
import "./Login.css";

const LOADING_DURATION = 2200; // ms - loader duration
const VIGNETTE_DURATION = 1800; // ms - vignette visible time (fade out in CSS)
const TEXT_ROTATE_INTERVAL = 500; // ms - (if you want text rotation later)

/**
 * Versión B: Mantengo tu estructura, mejoro timings, sync loader -> vignette -> welcome.
 * - loader (progress) se muestra y anima del 0 al 100
 * - al terminar loader aparece la vignette (cinemática) durante VIGNETTE_DURATION
 * - luego se muestra WelcomeLoader
 */

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [toast, setToast] = useState(null);

  // loader states
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  // vignette and welcome states
  const [showVignette, setShowVignette] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // optional rotating texts state (left ready - not enabled by default)
  const texts = [
    "Inicializando protocolos…",
    "Autenticando usuario…",
    "Sincronizando módulo de entrada…",
  ];
  const [rotTextIndex, setRotTextIndex] = useState(0);
  const rotRef = useRef(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
      if (rotRef.current) clearInterval(rotRef.current);
    };
  }, []);

  // small helper to show toast
  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // progress animation driven by JS (so width updates smoothly with state)
  const startProgress = () => {
    // We'll step progress at 30fps
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
      }
    }, Math.floor(LOADING_DURATION / steps));
  };

  // Optional: rotate texts (not required but ready).
  const startRotatingTexts = () => {
    if (rotRef.current) clearInterval(rotRef.current);
    rotRef.current = setInterval(() => {
      setRotTextIndex((i) => (i + 1) % texts.length);
    }, TEXT_ROTATE_INTERVAL);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showToast("⚠️ Debes completar todos los campos.");
      return;
    }

    try {
      const res = await api.post("/auth/login", { username, password });

      if (res.data.success) {
        // persist token & user
        localStorage.setItem("token", res.data.token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;
        localStorage.setItem("user", JSON.stringify(res.data.user));

        if (rememberMe) {
          localStorage.setItem("rememberedUsername", username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }

        showToast("🔥 Autenticación correcta", "success");

        // Start loader cycle
        setLoading(true);
        setProgress(0);
        startProgress();
        // (optional) start rotating texts while loader shows:
        // startRotatingTexts();

        // After loader ends -> hide loader, show vignette, then WelcomeLoader
        setTimeout(() => {
          setLoading(false);

          // stop rotating texts (optional)
          if (rotRef.current) {
            clearInterval(rotRef.current);
            rotRef.current = null;
            setRotTextIndex(0);
          }

          // show vignette (fade & cinematic). It hides itself via timeout here.
          setShowVignette(true);

          setTimeout(() => {
            setShowVignette(false);
            setShowWelcome(true);
          }, VIGNETTE_DURATION + 120); // small buffer
        }, LOADING_DURATION + 60);
      } else {
        showToast(res.data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  // If welcome step active show WelcomeLoader (keeps your flow)
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
      {/* TOAST */}
      {toast && <ToastNotification message={toast.message} type={toast.type} />}

      {/* LOADER GLITCH (visible while loading === true) */}
      {loading && (
        <div
          className="initial-loader-overlay"
          role="status"
          aria-live="polite"
        >
          <div className="initial-loader-content">
            {/* If you want text rotation enable startRotatingTexts() above */}
            <div
              className="glitch-title"
              data-text={`${texts[rotTextIndex]} ${progress}%`}
            >
              {`${texts[rotTextIndex]} ${progress}%`}
            </div>

            <div className="loader-bar" aria-hidden="true">
              <div
                className="loader-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* VIGNETTE: only render when showVignette is true (prevents overlapping) */}

      {/* MAIN SCREEN */}
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
                  autoComplete="username"
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
                  autoComplete="current-password"
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
};

export default Login;
