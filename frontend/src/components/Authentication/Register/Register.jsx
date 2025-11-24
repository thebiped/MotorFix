import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import api from "../../../services/api";

import ToastNotification from "../../notification/ToastNotification";
import "./Register.css";

import logo from "../../../assets/img/logo.png";
import bg_register from "../../../assets/img/bg_register.png";

const LOADING_DURATION = 2200;
const VIGNETTE_DURATION = 1800;

const Register = () => {
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // loader states
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  // vignette
  const [showVignette, setShowVignette] = useState(false);

  useEffect(() => {
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const startProgress = () => {
    const fps = 30;
    const steps = Math.floor((LOADING_DURATION / 1000) * fps);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword)
      return showToast("⚠️ Todos los campos son obligatorios");

    if (password !== confirmPassword)
      return showToast("❌ Las contraseñas no coinciden");

    try {
      // Real request optional:
      await api.post("/auth/register", { username, email, password });

      showToast("✅ Procesando registro…", "success");

      setLoading(true);
      startProgress();

      setTimeout(() => {
        setLoading(false);
        setShowVignette(true);

        setTimeout(() => {
          setShowVignette(false);
          navigate("/vehicle-selection");
        }, VIGNETTE_DURATION + 80);
      }, LOADING_DURATION + 80);
    } catch (err) {
      console.error(err);
      showToast("Error en el registro");
    }
  };

  return (
    <>
      {/* LOADER GLITCH */}
      {loading && (
        <div className="initial-register-overlay">
          <div className="initial-register-content">
            <div
              className="register-glitch-title"
              data-text={`Procesando registro… ${progress}%`}
            >
              {`Procesando registro… ${progress}%`}
            </div>

            <div className="register-loader-bar">
              <div
                className="register-loader-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* VIGNETTE CINEMÁTICA */}

      {/* MAIN LAYOUT */}
      <div className="register-container">
        {/* FORM FIRST (para que loader y vignette queden arriba) */}
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

        {/* BACKGROUND SEGUNDO */}
      </div>
    </>
  );
};

export default Register;
