import "./LoadingScreen.css";

const LoadingScreen = ({ visible }) => {
  return (
    <div className={`loading-overlay ${visible ? "show" : ""}`}>
      <div className="loading-circle"></div>
      <p className="loading-text">Iniciando sesión...</p>
    </div>
  );
};

export default LoadingScreen;
