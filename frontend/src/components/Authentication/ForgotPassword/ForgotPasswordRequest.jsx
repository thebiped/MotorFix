import { useState } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { MdOutlineEmail } from "react-icons/md";

const ForgotPasswordRequest = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) return alert("Debes ingresar un email.");

    try {
      setLoading(true);

      const res = await api.post("/auth/forgot-password", { email });

      if (res.data.success) {
        localStorage.setItem("reset_email", email);
        navigate("/forgot-password/verify");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error al enviar solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <h2>Recuperar contraseña</h2>
      <p>Ingresa tu email para recibir un código de verificación.</p>

      <form onSubmit={handleSendEmail}>
        <div className="forgot-password-input-box">
          <MdOutlineEmail size={20} />
          <input
            type="email"
            placeholder="Tu email…"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="forgot-password-button">
          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar email"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordRequest;
