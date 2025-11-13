import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Clock,
  Car,
  Calendar,
  User,
  Bell,
  LogOut,
} from "lucide-react";
import Logo from "../../assets/img/Logo.png";
import "./ClienteLayout.css";

const menuItems = [
  {
    path: "/cliente/dashboard",
    icon: <LayoutDashboard size={24} strokeWidth={1.5} />,
    label: "Dashboard",
  },
  {
    path: "/cliente/vehiculo",
    icon: <Car size={24} strokeWidth={1.5} />,
    label: "Vehículo",
  },
  {
    path: "/cliente/turnos",
    icon: <Calendar size={24} strokeWidth={1.5} />,
    label: "Turnos",
  },
  {
    path: "/cliente/historial",
    icon: <Clock size={24} strokeWidth={1.5} />,
    label: "Historial",
  },
  {
    path: "/cliente/perfil",
    icon: <User size={24} strokeWidth={1.5} />,
    label: "Perfil",
  },
];

const ClienteLayout = () => {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.rol !== "cliente") navigate("/");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="cliente-layout">
      <aside
        className={`cliente-sidebar ${sidebarExpanded ? "expanded" : ""}`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="cliente-logo">
          <img src={Logo} alt="logo" />
        </div>
        <nav className="cliente-nav">
          {menuItems.map((item, index) => (
            <NavLink key={index} to={item.path} className="cliente-link">
              {item.icon}
              {sidebarExpanded && (
                <span className="link-label">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="cliente-main">
        <header className="cliente-header">
          <input
            type="text"
            placeholder="Buscar..."
            className="cliente-search"
          />
          <div className="cliente-header-actions">
            <Bell className="icon-btn" />
            <User
              className="icon-btn"
              onClick={() => navigate("/cliente/perfil")}
            />
            <LogOut className="icon-btn logout" onClick={handleLogout} />
          </div>
        </header>

        <main className="cliente-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClienteLayout;
