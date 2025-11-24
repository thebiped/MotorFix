import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Clock,
  Wrench,
  ClipboardList,
  User,
  Bell,
  LogOut,
} from "lucide-react";
import Logo from "../../assets/img/Logo.png";
import "./MecanicoLayout.css";

const menuItems = [
  {
    path: "/mecanico/dashboard",
    icon: <LayoutDashboard size={22} strokeWidth={1.5} />,
    label: "Dashboard",
  },
  {
    path: "/mecanico/reparaciones",
    icon: <Wrench size={22} strokeWidth={1.5} />,
    label: "Reparaciones",
  },
  {
    path: "/mecanico/historial",
    icon: <ClipboardList size={22} strokeWidth={1.5} />,
    label: "Historial",
  },
  {
    path: "/mecanico/notificaciones",
    icon: (
      <div style={{ position: "relative" }}>
        <Bell size={22} strokeWidth={1.5} />
        <div className="bat-notify-dot"></div>
      </div>
    ),
    label: "Notificaciones",
  },
  {
    path: "/mecanico/perfil",
    icon: <User size={22} strokeWidth={1.5} />,
    label: "Perfil",
  },
];

const MecanicoLayout = () => {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.rol !== "mecanico") navigate("/");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="mecanico-layout">
      {/* CONTENIDO */}
      <div className="mecanico-main">
        <main className="mecanico-content">
          <Outlet />
        </main>
      </div>

      {/* 🔥 MISMA NAVBAR INFERIOR ARKHAM FUTURISTA */}
      <nav className="bat-navbar">
        <div className="bat-panel">
          {menuItems.map((item, index) => (
            <NavLink key={index} to={item.path} className="bat-link">
              {item.icon}
              <span className="bat-tooltip">{item.label}</span>
            </NavLink>
          ))}

          {/* Logout */}
          <LogOut className="bat-link logout-btn" onClick={handleLogout} />
        </div>
      </nav>
    </div>
  );
};

export default MecanicoLayout;
