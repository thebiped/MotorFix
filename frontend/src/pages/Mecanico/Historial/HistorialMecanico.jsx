import React, { useState } from "react";
import "./HistorialMecanico.css";
import { FaDownload, FaStar } from "react-icons/fa";

const HistorialMecanico = () => {
  const [busqueda, setBusqueda] = useState("");

  const resumenStats = [
    {
      titulo: "Total Reparaciones",
      valor: 5,
      desc: "Completadas",
      color: "gray",
    },
    {
      titulo: "Ganancias Totales",
      valor: "$4.700",
      desc: "En reparaciones",
      color: "red",
    },
    {
      titulo: "Calificación Promedio",
      valor: "4.84/5.0",
      desc: "Satisfacción de clientes",
      color: "green",
    },
  ];

  const historialReparaciones = [
    {
      id: 1,
      patente: "ABC 123",
      vehiculo: "Ford Focus 2020",
      cliente: "Carlos Mendoza",
      trabajo: "Cambio de aceite",
      fechaIngreso: "01/03/2024",
      fechaEgreso: "03/03/2024",
      costo: 450,
      calificacion: 5.0,
    },
    {
      id: 2,
      patente: "GHI 789",
      vehiculo: "Volkswagen Gol 2019",
      cliente: "Ana García",
      trabajo: "Diagnóstico motor",
      fechaIngreso: "10/03/2024",
      fechaEgreso: "12/03/2024",
      costo: 800,
      calificacion: 4.9,
    },
  ];

  const handleBuscar = (evento) => {
    setBusqueda(evento.target.value);
  };

  const reparacionesFiltradas = historialReparaciones.filter(
    (reparacion) =>
      reparacion.patente.toLowerCase().includes(busqueda.toLowerCase()) ||
      reparacion.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      reparacion.trabajo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[oklch(0.98_0_0)]">
            Historial de Reparaciones
          </h1>
          <p className="text-gray-400 mt-1">
            Revisa todas tus reparaciones completadas
          </p>
        </div>
        <button className="px-4 py-2 bg-[oklch(0.65_0.22_25)] text-[oklch(0.98_0_0)] rounded-lg hover:bg-[oklch(0.55_0.22_25)] flex items-center gap-2">
          <FaDownload />
          Descargar Historial
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resumenStats.map((stat, index) => (
          <div key={index} className="bg-[oklch(0.25_0.12_25)] p-4 rounded-lg">
            <h3 className="text-[oklch(0.98_0_0)]">{stat.titulo}</h3>
            <p className="text-2xl font-bold text-[oklch(0.98_0_0)]">
              {stat.valor}
            </p>
            <p className="text-gray-400 text-sm">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-[oklch(0.25_0.12_25)] p-4 rounded-lg">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por patente, cliente o trabajo..."
            value={busqueda}
            onChange={handleBuscar}
            className="w-full p-3 pr-10 rounded-lg bg-[oklch(0.15_0_0)] text-[oklch(0.98_0_0)] border border-[oklch(0.3_0.12_25)] focus:outline-none focus:border-[oklch(0.65_0.22_25)]"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[oklch(0.25_0.12_25)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[oklch(0.15_0_0)]">
              <tr>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Patente
                </th>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Trabajo
                </th>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Ingreso
                </th>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Egreso
                </th>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Costo
                </th>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Calificación
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[oklch(0.3_0.12_25)]">
              {reparacionesFiltradas.length > 0 ? (
                reparacionesFiltradas.map((reparacion) => (
                  <tr
                    key={reparacion.id}
                    className="hover:bg-[oklch(0.3_0.12_25)] transition-colors"
                  >
                    <td className="px-6 py-4 text-[oklch(0.98_0_0)]">
                      {reparacion.patente}
                    </td>
                    <td className="px-6 py-4 text-[oklch(0.98_0_0)]">
                      {reparacion.vehiculo}
                    </td>
                    <td className="px-6 py-4 text-[oklch(0.98_0_0)]">
                      {reparacion.cliente}
                    </td>
                    <td className="px-6 py-4 text-[oklch(0.98_0_0)]">
                      {reparacion.trabajo}
                    </td>
                    <td className="px-6 py-4 text-[oklch(0.98_0_0)]">
                      {reparacion.fechaIngreso}
                    </td>
                    <td className="px-6 py-4 text-[oklch(0.98_0_0)]">
                      {reparacion.fechaEgreso}
                    </td>
                    <td className="px-6 py-4 text-[oklch(0.98_0_0)]">
                      ${reparacion.costo}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-[oklch(0.98_0_0)]">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span>{reparacion.calificacion}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <span className="text-3xl mb-2">🕐</span>
                      <p>No se encontraron reparaciones con ese criterio</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistorialMecanico;
