import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./ForgotPassword.css";

const ForgotPasswordReset = () => {
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem("reset_email");

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  if (!storedEmail) {
    navigate("/forgot-password");
  }

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password.trim() || !password2.trim())
      return alert("Completa todos los campos.");

    if (password !== password2)
      return alert("Las contraseñas no coinciden.");

    try {
      setLoading(true);

      const res = await api.post("/auth/reset-password", {
        email: storedEmail,
        newPassword: password,
      });

      if (res.data.success) {
        alert("Contraseña actualizada con éxito.");
        localStorage.removeItem("reset_email");
        navigate("/");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <h2>Nueva contraseña</h2>
      <p>Ingresa tu nueva contraseña para continuar.</p>

      <form onSubmit={handleReset} className="forgot-password-form">
        <div className="forgot-password-input-box">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="forgot-password-input-box">
          <input
            type="password"
            placeholder="Repetir contraseña"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>

        <div className="forgot-password-button">
          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordReset;
