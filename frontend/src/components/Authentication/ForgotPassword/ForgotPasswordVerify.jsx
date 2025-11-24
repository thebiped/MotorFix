import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./ForgotPassword.css";

const ForgotPasswordVerify = () => {
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem("reset_email");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  if (!storedEmail) {
    navigate("/forgot-password");
  }

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!code.trim() || code.length !== 6)
      return alert("Ingresa el código de 6 dígitos.");

    try {
      setLoading(true);

      const res = await api.post("/auth/verify-code", {
        email: storedEmail,
        code,
      });

      if (res.data.success) {
        navigate("/forgot-password/reset");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error al verificar código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <h2>Verificación</h2>
      <p>Ingresa el código que enviamos a tu correo.</p>

      <form onSubmit={handleVerify}>
        <div className="forgot-password-input-box">
          <input
            type="text"
            maxLength={6}
            placeholder="Código de 6 dígitos"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="forgot-password-button">
          <button type="submit" disabled={loading}>
            {loading ? "Verificando..." : "Continuar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordVerify;
