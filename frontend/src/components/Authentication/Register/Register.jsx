import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import api from "../../../services/api";
import ToastNotification from "../../notification/ToastNotification";
import "./Register.css";
import logo from "../../../assets/img/logo.png";
import bg_register from "../../../assets/img/bg_register.png";

const Register = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      return showToast("⚠️ Todos los campos son obligatorios");
    }
    if (password !== confirmPassword) {
      return showToast("❌ Las contraseñas no coinciden");
    }

    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      // Guardar token y usuario
      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      showToast("✅ Registro exitoso", "success");

      setTimeout(() => {
        navigate("/"); 
      }, 1500);
    } catch (err) {
      console.log(err.response?.data);
      showToast(err.response?.data?.message || "Error en el registro", "error");
    }
  };

  return (
    <div className="register-container">
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="register-form-section">
        <div className="register-logo">
          <img src={logo} alt="Logo" />
          <h2 className="register-title">Crear una cuenta</h2>
        </div>

        <form className="register-form" onSubmit={(e) => e.preventDefault()}>
          <div className="register-group">
            <label>Username</label>
            <div className="register-input-box">
              <FaRegUser size={20} />
              <input
                type="text"
                name="username"
                placeholder="Nombre de usuario..."
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="register-group">
            <label>Email</label>
            <div className="register-input-box">
              <MdOutlineEmail size={20} />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico..."
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="register-group">
            <label>Contraseña</label>
            <div className="register-input-box">
              <CiLock size={20} />
              <input
                type="password"
                name="password"
                placeholder="Contraseña..."
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="register-group">
            <label>Confirmar contraseña</label>
            <div className="register-input-box">
              <CiLock size={20} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña..."
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button className="register-btn" type="button" onClick={handleSubmit}>
            Registrarse
          </button>
        </form>

        <p className="login-register-text">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/" className="login-register-link">
            Iniciar sesión
          </Link>
        </p>
      </div>

      <div className="register-bg">
        <div className="overlay"></div>
        <img src={bg_register} alt="Background car" />
      </div>
    </div>
  );
};

export default Register;
