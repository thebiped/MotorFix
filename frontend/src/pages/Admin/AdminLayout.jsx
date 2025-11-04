import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Package,
  Wrench,
  User,
  Bell,
  LogOut,
  ClipboardList,
  Car
} from "lucide-react";
import Logo from "../../assets/img/Logo.png";
import "./AdminLayout.css";

const menuItems = [
  { path: "/admin/dashboard", icon: <LayoutDashboard size={22} />, label: "Dashboard" },
  { path: "/admin/gestiones", icon: <ClipboardList size={22} />, label: "Gestiones" },
  { path: "/admin/reparaciones", icon: <Wrench size={22} />, label: "Reparaciones" },
  { path: "/admin/vehiculos", icon: <Car size={22} />, label: "Vehículos" },
  { path: "/admin/perfil", icon: <User size={22} />, label: "Perfil" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.rol !== "admin") navigate("/");
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
        className={`admin-sidebar ${sidebarExpanded ? "expanded" : ""}`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="admin-logo">
          <img src={Logo} alt="logo" />
        </div>

        <nav className="admin-nav">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className="admin-link"
            >
              {item.icon}
              {sidebarExpanded && <span className="link-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="admin-main">
        {/* HEADER */}
        <header className="admin-header">
          <input type="text" placeholder="Buscar..." className="admin-search" />
          <div className="admin-header-actions">
            <Bell className="icon-btn" />
            <User className="icon-btn" onClick={() => navigate("/admin/perfil")} />
            <LogOut className="icon-btn logout" onClick={handleLogout} />
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
