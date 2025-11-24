import React from "react";

const LoadingScreen = ({ visible }) => {
  if (!visible) return null;

  return (
    <>
      <div className="loading-screen-overlay">
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>AUTENTICANDO CREDENCIALES...</p>
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;
