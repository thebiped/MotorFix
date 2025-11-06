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
    icon: <LayoutDashboard size={24} strokeWidth={1.5} />,
    label: "Dashboard",
  },
  {
    path: "/mecanico/reparaciones",
    icon: <Wrench size={24} strokeWidth={1.5} />,
    label: "Reparaciones",
  },
  {
    path: "/mecanico/horario",
    icon: <Clock size={24} strokeWidth={1.5} />,
    label: "Horario",
  },
  {
    path: "/mecanico/historial",
    icon: <ClipboardList size={24} strokeWidth={1.5} />,
    label: "Historial",
  },
  {
    path: "/mecanico/perfil",
    icon: <User size={24} strokeWidth={1.5} />,
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
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside
        className={`mecacnico-sidebar ${sidebarExpanded ? "expanded" : ""}`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="mecacnico-logo">
          <img src={Logo} alt="logo" />
        </div>

        <nav className="mecacnico-nav">
          {menuItems.map((item, index) => (
            <NavLink key={index} to={item.path} className="mecacnico-link">
              {item.icon}
              {sidebarExpanded && (
                <span className="link-label">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="mecacnico-main">
        {/* HEADER */}
        <header className="mecacnico-header">
          <input type="text" placeholder="Buscar..." className="mecacnico-search" />
          <div className="mecacnico-header-actions">
            <Bell className="icon-btn" />
            <User
              className="icon-btn"
              onClick={() => navigate("/mecanico/perfil")}
            />
            <LogOut className="icon-btn logout" onClick={handleLogout} />
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <main className="mecacnico-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MecanicoLayout;
