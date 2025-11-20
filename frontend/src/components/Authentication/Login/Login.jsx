import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import api from "../../../services/api";
import bg_login from "../../../assets/img/bg_login.png";
import logo from "../../../assets/img/logo.png";
import ToastNotification from "../../notification/ToastNotification";
import LoadingScreen from "../../Loading/LoadingScreen";
import WelcomeLoader from "../../Welcome/WelcomeLoader";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);

  const [loading, setLoading] = useState(false); // Loading estilo Gotham/NFS
  const [showWelcome, setShowWelcome] = useState(false); // Pantalla WelcomeLoader

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      const missing = [];
      if (!username.trim()) missing.push("nombre de usuario");
      if (!password.trim()) missing.push("contraseña");
      showToast(
        missing.length === 1
          ? `⚠️ El campo ${missing[0]} es obligatorio`
          : `⚠️ Los campos ${missing.join(" y ")} son obligatorios`
      );
      return;
    }

    try {
      const res = await api.post("/auth/login", { username, password });

      if (res.data.success) {
        // Guardar usuario y token
        localStorage.setItem("token", res.data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        localStorage.setItem("user", JSON.stringify(res.data.user));

        showToast("✅ Inicio de sesión exitoso", "success");

        // Activa la animación Gotham/NFS
        setLoading(true);

        // Cuando termina el loading, activa WelcomeLoader
        setTimeout(() => {
          setLoading(false);
          setShowWelcome(true);
        }, 2200); // Duración del loading inicial
      } else {
        showToast(res.data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  // Si está en la pantalla de bienvenida, se renderiza esto
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
      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Animación Gotham/NFS */}
      <LoadingScreen visible={loading} />

      <div className="login-container">
        <div className="login">
          <div className="login-logo">
            <img src={logo} alt="Logo" />
            <h2 className="login-title">Inicio de sesión</h2>
          </div>

          <form className="login-form-container" onSubmit={handleLogin}>
            <div className="login-form-group">
              <label>Username</label>
              <div className="login-input-box">
                <FaRegUser size={20} fill="#fff" />
                <input
                  type="text"
                  placeholder="Tu usuario..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="login-form-group">
              <label>Password</label>
              <div className="login-input-box">
                <CiLock size={20} fill="#fff" />
                <input
                  type="password"
                  name="password"
                  placeholder="Tu contraseña..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button className="login-btn" type="submit">
              Iniciar sesión
            </button>
          </form>

          <p className="register-text">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="register-link">
              Registrarse
            </Link>
          </p>
        </div>

        <div className="login-bg">
          <div className="overlay"></div>
          <img src={bg_login} alt="Car background" />
        </div>
      </div>
    </>
  );
};

export default Login;
