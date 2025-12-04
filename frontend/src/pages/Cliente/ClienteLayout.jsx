import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Car,
  Calendar,
  Clock,
  User,
  Bell,
  LogOut,
} from "lucide-react";
import "./ClienteLayout.css";

const menuItems = [
  { path: "/cliente/dashboard", icon: <LayoutDashboard size={22} />, label: "Dashboard" },
  { path: "/cliente/vehiculo", icon: <Car size={22} />, label: "Vehículo" },
  { path: "/cliente/turnos", icon: <Calendar size={22} />, label: "Turnos" },
  { path: "/cliente/perfil", icon: <User size={22} />, label: "Perfil" },
  { path: "/cliente/notificaciones", icon: <Bell size={22} />, label: "Notificaciones" },
];

const ClienteLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showVignette, setShowVignette] = useState(false);
  const [userId, setUserId] = useState(null);

  // ⛔ Verifica rol y obtiene user desde localStorage (o redirige)
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || storedUser.rol !== "cliente") {
        navigate("/");
        return;
      }
      // el user object puede tener id o id_usuario, cubrimos ambos
      const id = storedUser?.id ?? storedUser?.id_usuario ?? storedUser?.userId;
      setUserId(id ?? null);
      console.log("[ClienteLayout] storedUser:", storedUser, "-> userId:", id);
    } catch (err) {
      console.warn("Error parseando localStorage user", err);
      navigate("/");
    }
  }, [navigate]);

  // animación
  useEffect(() => {
    setShowVignette(true);
    const timer = setTimeout(() => setShowVignette(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="cliente-layout">
      {showVignette && <div className="vignette-cinematic" />}

      <div className="cliente-main">
        <main className="cliente-content">
          {/* pasamos userId (si lo tenemos) al Outlet */}
          <Outlet context={{ userId }} />
        </main>
      </div>

      <nav className="bat-navbar">
        <div className="bat-panel">
          {menuItems.map((item, index) => (
            <NavLink key={index} to={item.path} className="bat-link">
              {item.icon}
              <span className="bat-tooltip">{item.label}</span>
            </NavLink>
          ))}

          <LogOut className="bat-link logout-btn" onClick={handleLogout} />
        </div>
      </nav>
    </div>
  );
};

export default ClienteLayout;
