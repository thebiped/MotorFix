import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  Car,
  User,
  Bell,
  LogOut,
} from "lucide-react";
import ScreenVignette from "../../components/ScreenVignette/ScreenVignette";
import "./AdminLayout.css";

const menuItems = [
  {
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={22} />,
    label: "Dashboard",
  },
  {
    path: "/admin/gestiones",
    icon: <ClipboardList size={22} />,
    label: "Gestiones",
  },
  {
    path: "/admin/reparaciones",
    icon: <Wrench size={22} />,
    label: "Reparaciones",
  },
  { path: "/admin/vehiculos", icon: <Car size={22} />, label: "Vehículos" },
  {
    path: "/admin/notificaciones",
    icon: <Bell size={22} />,
    label: "Notificaciones",
  },
  { path: "/admin/perfil", icon: <User size={22} />, label: "Perfil" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState({});

  const [showVignette, setShowVignette] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.rol !== "admin") {
      navigate("/");
    } else {
      setCurrentUser(storedUser);
    }
  }, [navigate]);

  // 🔥 Disparar animación al cambiar de sección
  useEffect(() => {
    setShowVignette(true);

    const timeout = setTimeout(() => setShowVignette(false), 1800);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="admin-layout">
      {/* 🔥 ANIMACIÓN HUD ACTIVA SEGÚN ESTADO */}
      {showVignette && <ScreenVignette />}

      <div className="admin-main">
        <main className="admin-content">
          <Outlet context={{ userId: currentUser?.id }} />
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

export default AdminLayout;
