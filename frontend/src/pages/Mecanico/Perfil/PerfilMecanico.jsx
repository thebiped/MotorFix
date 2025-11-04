import React from "react";
import "./PerfilMecanico.css";
import {
  FaPencilAlt,
  FaStar,
  FaTools,
  FaAward,
  FaCertificate,
} from "react-icons/fa";

const PerfilMecanico = () => {
  const perfil = {
    nombre: "Carlos Javier Rodríguez",
    rol: "Mecánico Especialista",
    email: "carlos.rodriguez@taller.com",
    telefono: "+34 612 345 678",
    ubicacion: "Madrid, España",
    miembroDesde: "15/01/2023",
    especialidades: [
      "Diagnóstico motor",
      "Sistemas eléctricos",
      "Mecánica general",
      "Cambio de aceite",
    ],
  };

  const estadisticas = [
    {
      titulo: "Total Reparaciones",
      valor: "185",
      indicador: "↑ 12% este mes",
      icono: <FaTools className="text-red-500" />,
    },
    {
      titulo: "Tasa de Finalización",
      valor: "98.5%",
      indicador: "Excelente desempeño",
      icono: <FaStar className="text-green-500" />,
    },
    {
      titulo: "Calificación Promedio",
      valor: "4.8/5.0",
      indicador: "Muy satisfecho",
      icono: <FaStar className="text-yellow-400" />,
    },
    {
      titulo: "Ganancias Totales",
      valor: "$45.230",
      indicador: "Generado este año",
      icono: <FaStar className="text-[oklch(0.65_0.22_25)]" />,
    },
  ];

  const logros = [
    {
      titulo: "Mecánico del Mes",
      fecha: "Febrero 2024",
      icono: "🏆",
      color: "yellow",
    },
    {
      titulo: "100 Reparaciones Completadas",
      fecha: "Diciembre 2023",
      icono: "🎯",
      color: "green",
    },
    {
      titulo: "Especialista Certificado",
      fecha: "Noviembre 2023",
      icono: "🌟",
      color: "blue",
    },
  ];

  const certificaciones = [
    {
      nombre: "Certificado de Mecánica",
      validez: "15/01/2026",
      estado: "Activo",
    },
    {
      nombre: "Certificado de Diagnóstico",
      validez: "20/03/2025",
      estado: "Activo",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[oklch(0.98_0_0)]">
            Mi Perfil
          </h1>
          <p className="text-gray-400 mt-1">
            Gestiona tu información personal y profesional
          </p>
        </div>
        <button className="px-4 py-2 bg-[oklch(0.65_0.22_25)] text-[oklch(0.98_0_0)] rounded-lg hover:bg-[oklch(0.55_0.22_25)] flex items-center gap-2">
          <FaPencilAlt />
          Editar perfil
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-[oklch(0.25_0.12_25)] p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-[oklch(0.3_0.12_25)] flex items-center justify-center text-4xl border-4 border-[oklch(0.65_0.22_25)]">
              {perfil.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[oklch(0.98_0_0)] text-center md:text-left">
              {perfil.nombre}
            </h2>
            <p className="text-gray-400 mb-4 text-center md:text-left">
              {perfil.rol}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">📧 Email</p>
                <p className="text-[oklch(0.98_0_0)]">{perfil.email}</p>
              </div>
              <div>
                <p className="text-gray-400">📞 Teléfono</p>
                <p className="text-[oklch(0.98_0_0)]">{perfil.telefono}</p>
              </div>
              <div>
                <p className="text-gray-400">📍 Ubicación</p>
                <p className="text-[oklch(0.98_0_0)]">{perfil.ubicacion}</p>
              </div>
              <div>
                <p className="text-gray-400">📅 Miembro desde</p>
                <p className="text-[oklch(0.98_0_0)]">{perfil.miembroDesde}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-400 mb-2">Especialidades</p>
              <div className="flex flex-wrap gap-2">
                {perfil.especialidades.map((esp, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[oklch(0.3_0.12_25)] text-[oklch(0.98_0_0)] rounded-full text-sm"
                  >
                    {esp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estadisticas.map((stat, index) => (
          <div key={index} className="bg-[oklch(0.25_0.12_25)] p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              {stat.icono}
              <h3 className="text-[oklch(0.98_0_0)]">{stat.titulo}</h3>
            </div>
            <p className="text-2xl font-bold text-[oklch(0.98_0_0)]">
              {stat.valor}
            </p>
            <p className="text-gray-400 text-sm">{stat.indicador}</p>
          </div>
        ))}
      </div>

      {/* Achievements and Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <div className="bg-[oklch(0.25_0.12_25)] p-6 rounded-lg">
          <h3 className="text-xl font-bold text-[oklch(0.98_0_0)] mb-4 flex items-center gap-2">
            <FaAward />
            Logros Destacados
          </h3>
          <div className="space-y-4">
            {logros.map((logro, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-[oklch(0.3_0.12_25)] rounded-lg"
              >
                <div className="text-2xl">{logro.icono}</div>
                <div>
                  <h4 className="text-[oklch(0.98_0_0)] font-medium">
                    {logro.titulo}
                  </h4>
                  <p className="text-gray-400 text-sm">{logro.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-[oklch(0.25_0.12_25)] p-6 rounded-lg">
          <h3 className="text-xl font-bold text-[oklch(0.98_0_0)] mb-4 flex items-center gap-2">
            <FaCertificate />
            Certificaciones
          </h3>
          <div className="space-y-4">
            {certificaciones.map((cert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[oklch(0.3_0.12_25)] rounded-lg"
              >
                <div>
                  <h4 className="text-[oklch(0.98_0_0)] font-medium">
                    {cert.nombre}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Válido hasta: {cert.validez}
                  </p>
                </div>
                <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs font-medium">
                  {cert.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilMecanico;
