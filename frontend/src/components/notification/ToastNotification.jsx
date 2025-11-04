import React, { useEffect } from "react";
import "./ToastNotification.css";

const ToastNotification = ({ message, type = "error", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-container">
      <div className={`toast ${type}`}>
        {message}
      </div>
    </div>
  );
};

export default ToastNotification;
