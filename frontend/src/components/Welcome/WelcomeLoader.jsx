import { useEffect } from "react";
import "./WelcomeLoader.css";
import logo from "../../assets/img/Logo.png";

const WelcomeLoader = ({ name, onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 5000); // ⏱ 5 segundos

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="welcome-loader-container">
      <div className="logo-wrapper">
        <img
          src={logo}
          alt="Logo"
          className="logo-gotham"
        />
      </div>

      {/* ✔ nombre REAL del usuario garantizado */}
      <h1 className="welcome-text">
        Bienvenido <span className="welcome-name">{name}</span>
      </h1>
    </div>
  );
}

export default WelcomeLoader;