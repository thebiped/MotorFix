import React from "react";
import "./DashboardMecanico.css";
import {
  FaCar,
  FaCheckCircle,
  FaCalendarAlt,
  FaStar,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  Tooltip,
} from "recharts";

const DashboardMecanico = () => {
  const statsData = [
    {
      title: "Autos en reparación",
      value: 12,
      icon: <FaCar className="text-red-500" />,
      color: "bg-red-500",
    },
    {
      title: "Autos reparados hoy",
      value: 5,
      icon: <FaCheckCircle className="text-green-500" />,
      color: "bg-green-500",
    },
    {
      title: "Turnos pendientes",
      value: 8,
      icon: <FaCalendarAlt className="text-yellow-500" />,
      color: "bg-yellow-500",
    },
    {
      title: "Calificación promedio",
      value: "4.8/5",
      icon: <FaStar className="text-yellow-400" />,
      color: "bg-yellow-400",
    },
  ];

  const serviciosData = [
    { name: "Cambio de aceite", cantidad: 45 },
    { name: "Frenos", cantidad: 32 },
    { name: "Diagnóstico", cantidad: 28 },
    { name: "Motor", cantidad: 22 },
    { name: "Suspensión", cantidad: 18 },
    { name: "Eléctrico", cantidad: 15 },
  ];

  const eficienciaData = [
    { mes: "Enero", servicios: 85, satisfaccion: 92 },
    { mes: "Febrero", servicios: 90, satisfaccion: 95 },
    { mes: "Marzo", servicios: 92, satisfaccion: 98 },
  ];

  const mejoresTrabajos = [
    {
      id: 1,
      nombre: "Reparación motor completa",
      calificacion: 5.0,
      ganancia: 850,
      fecha: "01/03/2024",
    },
    {
      id: 2,
      nombre: "Cambio sistema frenos",
      calificacion: 4.9,
      ganancia: 720,
      fecha: "28/02/2024",
    },
    {
      id: 3,
      nombre: "Diagnóstico eléctrico",
      calificacion: 4.8,
      ganancia: 650,
      fecha: "25/02/2024",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[oklch(0.98_0_0)]">
            ¡Buen día, Carlos!
          </h1>
          <p className="text-gray-400 mt-1">
            Tienes {statsData[0].value} autos en reparación y{" "}
            {statsData[2].value} turnos pendientes
          </p>
        </div>
        <button className="px-4 py-2 bg-[oklch(0.65_0.22_25)] text-[oklch(0.98_0_0)] rounded-lg hover:bg-[oklch(0.55_0.22_25)]">
          Reportar Problema
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-[oklch(0.25_0.12_25)] p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              {stat.icon}
              <h3 className="text-[oklch(0.98_0_0)]">{stat.title}</h3>
            </div>
            <p className="text-2xl font-bold text-[oklch(0.98_0_0)]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ganancias */}
          <div className="bg-[oklch(0.25_0.12_25)] p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <FaMoneyBillWave className="text-[oklch(0.65_0.22_25)] text-2xl" />
              <div>
                <h3 className="text-[oklch(0.98_0_0)] text-lg font-bold">
                  Ganancias del Mes
                </h3>
                <p className="text-3xl font-bold text-[oklch(0.98_0_0)]">
                  $12.300
                </p>
                <span className="text-green-500">+15% vs mes anterior</span>
              </div>
            </div>
          </div>

          {/* Gráfico de Servicios */}
          <div className="bg-[oklch(0.25_0.12_25)] p-6 rounded-lg">
            <h3 className="text-[oklch(0.98_0_0)] text-lg font-bold mb-4">
              Servicios Realizados
            </h3>
            <div className="h-64">
              <BarChart width={600} height={250} data={serviciosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#e11d48" />
              </BarChart>
            </div>
          </div>

          {/* Gráfico de Eficiencia */}
          <div className="bg-[oklch(0.25_0.12_25)] p-6 rounded-lg">
            <h3 className="text-[oklch(0.98_0_0)] text-lg font-bold mb-4">
              Evolución de Eficiencia
            </h3>
            <div className="h-64">
              <LineChart width={600} height={250} data={eficienciaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="servicios" stroke="#e11d48" />
                <Line type="monotone" dataKey="satisfaccion" stroke="#22c55e" />
              </LineChart>
            </div>
          </div>
        </div>

        {/* Right Content (1/3) */}
        <div className="space-y-6">
          {/* Mejores Trabajos */}
          <div className="bg-[oklch(0.25_0.12_25)] p-6 rounded-lg">
            <h3 className="text-[oklch(0.98_0_0)] text-lg font-bold mb-4">
              Mejores Trabajos
            </h3>
            <div className="space-y-4">
              {mejoresTrabajos.map((trabajo) => (
                <div
                  key={trabajo.id}
                  className="border-b border-[oklch(0.3_0.12_25)] pb-4 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[oklch(0.98_0_0)]">
                        {trabajo.nombre}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{trabajo.fecha}</span>
                        <span>•</span>
                        <span>${trabajo.ganancia}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-[oklch(0.98_0_0)]">
                        {trabajo.calificacion}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mi Eficiencia */}
          <div className="bg-[oklch(0.25_0.12_25)] p-6 rounded-lg">
            <h3 className="text-[oklch(0.98_0_0)] text-lg font-bold mb-4">
              Mi Eficiencia
            </h3>
            <div className="space-y-4">
              {[
                { label: "Servicios completados", value: 92 },
                { label: "Satisfacción cliente", value: 98 },
                { label: "Utilización de tiempo", value: 85 },
              ].map((metrica, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[oklch(0.98_0_0)]">
                      {metrica.label}
                    </span>
                    <span className="text-[oklch(0.98_0_0)]">
                      {metrica.value}%
                    </span>
                  </div>
                  <div className="w-full bg-[oklch(0.15_0_0)] rounded-full h-2">
                    <div
                      className="bg-[oklch(0.65_0.22_25)] h-2 rounded-full"
                      style={{ width: `${metrica.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMecanico;
