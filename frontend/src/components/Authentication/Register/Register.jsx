import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";

import api from "../../../services/api";
import "./Register.css";

import logo from "../../../assets/img/logo.png";
import bg_register from "../../../assets/img/bg_register.png";

/* TIMINGS CINEMÁTICOS */
const TEXT_ROTATE_INTERVAL = 3000;
const LOADING_DURATION = 5200;
const ERROR_HOLD = 3600;
const SUCCESS_HOLD = 2600;

/* Textos HUD estilo Arkham */
const texts = [
  "Inicializando sistema…",
  "Cargando módulos de usuario…",
  "Preparando selección de vehículos…",
];

const Register = () => {
  const navigate = useNavigate();

  /* Campos form */
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /* Loader HUD */
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  /* Textos rotativos */
  const [rotTextIndex, setRotTextIndex] = useState(0);
  const rotRef = useRef(null);

  /* Mensajes HUD */
  const [loaderMessage, setLoaderMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* Rotación lenta */
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

  /* Progress lento */
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

  /* Reacciones del HUD durante el proceso */
  useEffect(() => {
    if (!loading) {
      setLoaderMessage("");
      setErrorMessage("");
      setSuccessMessage("");
      stopRotatingTexts();
      return;
    }

    let dynamicMessage = texts[rotTextIndex];

    if (progress >= 30 && progress < 70)
      dynamicMessage = "Verificando integridad de los datos…";

    if (progress >= 70 && progress < 100)
      dynamicMessage = "Conectando con el servidor…";

    if (progress >= 100) dynamicMessage = "";

    setLoaderMessage(dynamicMessage);
  }, [loading, progress, rotTextIndex]);

  /* On Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      triggerError("Debes completar todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      triggerError("Las contraseñas no coinciden.");
      return;
    }

    try {
      // 1. Realizar el post
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      }); // 2. CAPTURAR EL ID DEVUELTO
      const newUserId = response.data.user.id; // 3. ALMACENAR EL ID PARA EL SIGUIENTE PASO
      localStorage.setItem("temp_user_id", newUserId);
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      startRotatingTexts();
      startProgress();
      setLoaderMessage(texts[0]);

      setTimeout(() => {
        setSuccessMessage("Registro completado — Bienvenido al sistema.");

        setTimeout(() => {
          setLoading(false); // Navegamos al siguiente paso
          navigate("/vehicle-selection");
        }, SUCCESS_HOLD);
      }, LOADING_DURATION + 120);
    } catch (err) {
      triggerError(err.response?.data?.message || "Error en el registro.");
    }
  };

  /* ERROR estilo Arkham Knight */
  const triggerError = (msg) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    startRotatingTexts();
    startProgress();
    setLoaderMessage(texts[0]);

    setTimeout(() => {
      setErrorMessage(msg);

      setTimeout(() => {
        setLoading(false);
        setErrorMessage("");
      }, ERROR_HOLD);
    }, LOADING_DURATION - 120);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  return (
    <>
      {/* LOADER HUD */}
      {loading && (
        <div className="initial-register-overlay">
          <div className="initial-register-content arkham">
            {/* TEXTO PRINCIPAL */}
            {loaderMessage && (
              <div className="register-glitch-title" data-text={loaderMessage}>
                {loaderMessage}
              </div>
            )}

            {/* ÉXITO */}
            {successMessage && (
              <div className="hud-success-message">{successMessage}</div>
            )}

            {/* ERROR */}
            {errorMessage && (
              <div className="hud-error-message">ERROR: {errorMessage}</div>
            )}

            {/* Barra */}
            <div className="register-loader-bar">
              <div
                className="register-loader-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* FORMULARIO */}
      <div className="register-container">
        <div className="register-bg">
          <div className="register-overlay" />
          <img src={bg_register} alt="Background" />
        </div>

        <div className="register-form-section">
          <div className="register-logo">
            <img src={logo} alt="Logo" />
            <h2 className="register-title">Crear una cuenta</h2>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-group">
              <label>Username</label>
              <div className="register-input-box">
                <FaRegUser size={20} />
                <input
                  name="username"
                  type="text"
                  placeholder="Nombre de usuario..."
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="register-group">
              <label>Email</label>
              <div className="register-input-box">
                <MdOutlineEmail size={20} />
                <input
                  name="email"
                  type="email"
                  placeholder="Correo electrónico..."
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="register-group">
              <label>Contraseña</label>
              <div className="register-input-box">
                <CiLock size={20} />
                <input
                  name="password"
                  type="password"
                  placeholder="Contraseña..."
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="register-group">
              <label>Confirmar contraseña</label>
              <div className="register-input-box">
                <CiLock size={20} />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirmar contraseña..."
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="register-button">
              <button className="register-btn" type="submit">
                Continuar
              </button>
            </div>
          </form>

          <p className="login-text">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/" className="login-link">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
