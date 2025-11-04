import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaCarAlt,
  FaCalendarAlt,
  FaHistory,
  FaUser,
  FaSignOutAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import "./MecanicoLayout.css";

const MecanicoLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: "/mecanico/dashboard", icon: <FaChartPie />, text: "Dashboard" },
    {
      path: "/mecanico/reparaciones",
      icon: <FaCarAlt />,
      text: "Gestión de Autos",
    },
    { path: "/mecanico/horario", icon: <FaCalendarAlt />, text: "Mi Horario" },
    { path: "/mecanico/historial", icon: <FaHistory />, text: "Historial" },
    { path: "/mecanico/perfil", icon: <FaUser />, text: "Mi Perfil" },
  ];

  const handleLogout = () => {
    // Limpia token/localStorage y redirige al login
    try {
      localStorage.removeItem("token");
    } catch (e) {
      // ignore
    }
    navigate("/login");
  };

  const handleHelp = () => {
    // Mostrar ayuda mínima; puede reemplazarse por un modal de ayuda
    // o navegación a una página de soporte.
    // eslint-disable-next-line no-alert
    alert(
      "Si necesitas ayuda, contacta con soporte o revisa la documentación."
    );
  };

  return (
    <div className="flex h-screen bg-[oklch(0.2_0.15_25)]">
      {/* Sidebar */}
      <nav
        role="navigation"
        aria-label="Menú lateral mecánico"
        className={`mec-sidebar w-64 bg-[oklch(0.15_0_0)] p-4 flex flex-col ${
          sidebarOpen ? "mec-open" : "mec-closed"
        }`}
      >
        {/* Close button (mobile) */}
        <div className="lg:hidden flex justify-end">
          <button
            aria-label="Cerrar menú"
            className="p-2 text-[oklch(0.98_0_0)]"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        {/* Logo */}
        <div className="text-[oklch(0.98_0_0)] mb-8 text-2xl font-bold text-center">
          🔴 MotorFix
        </div>

        {/* Menu Items */}
        <div className="flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? "bg-[oklch(0.65_0.22_25)] text-[oklch(0.98_0_0)]"
                    : "text-gray-400 hover:bg-[oklch(0.25_0.12_25)] hover:text-[oklch(0.98_0_0)]"
                }`
              }
              end={item.path === "/mecanico/dashboard"}
            >
              {item.icon}
              <span>{item.text}</span>
            </NavLink>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-[oklch(0.25_0.12_25)] pt-4">
          <button
            onClick={handleHelp}
            className="flex items-center gap-3 p-3 w-full text-gray-400 hover:bg-[oklch(0.25_0.12_25)] hover:text-[oklch(0.98_0_0)] rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-[oklch(0.65_0.22_25)]"
            aria-label="Ayuda"
          >
            <FaQuestionCircle />
            <span>Ayuda</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full text-gray-400 hover:bg-[oklch(0.25_0.12_25)] hover:text-[oklch(0.98_0_0)] rounded-lg"
          >
            <FaSignOutAlt />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </nav>

      {/* Overlay for mobile when sidebar is open */}
      <div
        className={`mec-overlay ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={sidebarOpen ? "false" : "true"}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Mobile header: hamburger */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <button
            aria-label="Abrir menú"
            className="p-2 text-[oklch(0.98_0_0)]"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default MecanicoLayout;
