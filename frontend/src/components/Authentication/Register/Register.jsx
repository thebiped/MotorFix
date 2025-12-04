import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";

import api from "../../../services/api";
import "./Register.css";

import logo from "../../../assets/img/logo.png";
import bg_register from "../../../assets/img/bg_register.png";

/* TIMINGS CINEMÁTICOS (Copiados del Login) */
const TEXT_ROTATE_INTERVAL = 3600;
const LOADING_DURATION = 5200;
const ERROR_HOLD = 3600;
const SUCCESS_HOLD = 2600;

/* Textos HUD estilo Arkham (Actualizados para Registro) */
const texts = [
  "Inicializando protocolos de registro…",
  "Generando identidad de usuario…",
  "Sincronizando módulo de entrada…",
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

  /* Loader HUD Estados */
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rotTextIndex, setRotTextIndex] = useState(0);

  /* Resultado API / Mensajes */
  const [registerResult, setRegisterResult] = useState(null); // 'success' o { error: msg }
  const [loaderMessage, setLoaderMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* Referencias para limpieza */
  const progressRef = useRef(null);
  const rotRef = useRef(null);
  const timeoutRef = useRef([]);

  /* Limpieza al desmontar */
  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
      if (rotRef.current) clearInterval(rotRef.current);
      timeoutRef.current.forEach(clearTimeout);
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

  /* SINCRONIZACIÓN TOTAL DEL HUD (Reacciones según el progreso y resultado) */
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
      dynamicMessage = "Verificando integridad de los datos…";
    } else if (progress >= 70 && progress < 100) {
      dynamicMessage = "Conectando con el servidor…";
    } else if (progress >= 100 && registerResult == null) {
      dynamicMessage = "Finalizando proceso…";
    }

    /* No mostrar mensaje si la barra ya terminó */
    if (progress >= 100) {
      dynamicMessage = "";
    }

    setLoaderMessage(dynamicMessage);

    /* --- ÉXITO: APARECE MENSAJE HUD VERDE --- */
    if (progress >= 100 && registerResult === "success") {
      stopRotatingTexts();

      setSuccessMessage("REGISTRO COMPLETADO — Bienvenido al sistema.");

      const timer1 = setTimeout(() => {
        setSuccessMessage("");
        setLoading(false);
        navigate("/vehicle-selection"); // Navegación al siguiente paso
      }, SUCCESS_HOLD);
      timeoutRef.current.push(timer1);
    }

    /* --- ERROR: REPENTINO --- */
    if (progress >= 100 && typeof registerResult === "object") {
      stopRotatingTexts();

      const timer2 = setTimeout(() => {
        setErrorMessage(registerResult.error);
      }, 150);
      timeoutRef.current.push(timer2);

      const timer3 = setTimeout(() => {
        setLoading(false);
        setRegisterResult(null);
      }, ERROR_HOLD);
      timeoutRef.current.push(timer3);
    }
  }, [loading, rotTextIndex, progress, registerResult, navigate]);

  /* ERROR INSTANTÁNEO (Usado para validación de formulario) */
  const showImmediateLoaderError = (msg) => {
    // Limpiar mensajes antiguos
    setErrorMessage("");
    setRegisterResult({ error: msg });

    // Iniciar carga y progreso (la lógica de useEffect lo mostrará como error al 100%)
    setLoading(true);
    startProgress();
    startRotatingTexts(); // Necesario para que el useEffect tenga un índice
  };


  /* On Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      showImmediateLoaderError("Debes completar todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      showImmediateLoaderError("Las contraseñas no coinciden.");
      return;
    }

    // Limpiar estado de carga y resultados previos e iniciar la animación
    setLoading(true);
    setProgress(0);
    setRegisterResult(null);
    startRotatingTexts();
    startProgress();
    setLoaderMessage(texts[0]);


    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      if (response.data?.success) {
        // Guardar ID temporal para el siguiente paso
        const newUserId = response.data.user.id;
        localStorage.setItem("temp_user_id", newUserId);

        // Indicar ÉXITO al HUD
        setRegisterResult("success");

      } else {
        // Indicar ERROR al HUD
        setRegisterResult({
          error: response.data?.message || "Error en el registro.",
        });
      }

    } catch (err) {
      // Indicar ERROR de servidor/red al HUD
      setRegisterResult({
        error: err.response?.data?.message || "Error de servidor en el registro.",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  return (
    <>
      {/* LOADER HUD (Asegúrate de que las clases CSS sean las mismas que en Login.css) */}
      {loading && (
        <div className="initial-loader-overlay" role="status">
          <div className="initial-loader-content arkham">

            {/* TEXTO PRINCIPAL */}
            {loaderMessage && (
              <div className="glitch-title" data-text={loaderMessage}>
                {loaderMessage}
              </div>
            )}

            {/* ÉXITO */}
            {successMessage && (
              <div className="hud-success-message glitch-title" data-text={successMessage}>
                {successMessage}
              </div>
            )}

            {/* ERROR */}
            {errorMessage && (
              <div className="hud-error-message">ERROR: {errorMessage}</div>
            )}

            {/* Barra */}
            <div className="loader-bar">
              <div
                className="loader-bar-fill"
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
            </div>

            <div className="register-button">
              <button className="register-btn" type="submit" disabled={loading}>
                {loading ? "Procesando..." : "Continuar"}
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