import React, { useState } from "react";
import "./ReparacionesMecanico.css";
import {
  FaDownload,
  FaPlus,
  FaEye,
  FaPencilAlt,
  FaTrash,
} from "react-icons/fa";

const ReparacionesMecanico = () => {
  const [filtroActivo, setFiltroActivo] = useState("todas");
  const [modalVisible, setModalVisible] = useState(false);
  const [reparacionSeleccionada, setReparacionSeleccionada] = useState(null);

  const resumenStats = [
    {
      titulo: "Total Asignadas",
      valor: 5,
      desc: "Órdenes de trabajo",
      color: "gray",
    },
    {
      titulo: "En progreso",
      valor: 1,
      desc: "Trabajos activos",
      color: "orange",
    },
    { titulo: "Pendientes", valor: 2, desc: "Por iniciar", color: "yellow" },
    { titulo: "Completadas", valor: 2, desc: "Finalizadas", color: "green" },
  ];

  const reparaciones = [
    {
      id: 1,
      patente: "ABC 123",
      vehiculo: "Ford Focus 2020",
      cliente: "Carlos Mendoza",
      problema: "Cambio de aceite y filtros",
      estado: "pendiente",
      fechaIngreso: "12/03/2024",
      fechaEstimada: "14/03/2024",
      costo: 450,
    },
    {
      id: 2,
      patente: "XYZ 789",
      vehiculo: "Toyota Corolla 2021",
      cliente: "María López",
      problema: "Revisión de frenos",
      estado: "en_progreso",
      fechaIngreso: "11/03/2024",
      fechaEstimada: "13/03/2024",
      costo: 380,
    },
    // Agregar más reparaciones según sea necesario
  ];

  const handleVerDetalles = (reparacion) => {
    setReparacionSeleccionada(reparacion);
    setModalVisible(true);
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: "yellow",
      en_progreso: "orange",
      completada: "green",
    };
    return colores[estado] || "gray";
  };

  const getBadgeClasses = (estado) => {
    const color = getEstadoColor(estado);
    return `px-2 py-1 rounded text-xs font-medium text-${color}-500 bg-${color}-500/20`;
  };

  const getFilterButtonClasses = (filtroId) => {
    return filtroId === filtroActivo
      ? "px-4 py-2 rounded-lg bg-[oklch(0.65_0.22_25)] text-[oklch(0.98_0_0)]"
      : "px-4 py-2 rounded-lg bg-[oklch(0.15_0_0)] text-gray-400 hover:bg-[oklch(0.3_0.12_25)]";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[oklch(0.98_0_0)]">
            Gestión de Autos
          </h1>
          <p className="text-gray-400 mt-1">
            Administra los vehículos en reparación y sus estados
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-[oklch(0.65_0.22_25)] text-[oklch(0.98_0_0)] rounded-lg hover:bg-[oklch(0.25_0.12_25)] flex items-center gap-2">
            <FaDownload />
            Exportar
          </button>
          <button className="px-4 py-2 bg-[oklch(0.65_0.22_25)] text-[oklch(0.98_0_0)] rounded-lg hover:bg-[oklch(0.55_0.22_25)] flex items-center gap-2">
            <FaPlus />
            Nueva Reparación
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Filters */}
      <div className="bg-[oklch(0.25_0.12_25)] p-4 rounded-lg">
        <h3 className="text-[oklch(0.98_0_0)] mb-3">Filtros</h3>
        <div className="flex gap-3">
          {[
            { id: "todas", label: "Todas (5)" },
            { id: "en_progreso", label: "En progreso (1)" },
            { id: "pendiente", label: "Pendientes (2)" },
            { id: "completada", label: "Completadas (2)" },
          ].map((filtro) => (
            <button
              key={filtro.id}
              className={getFilterButtonClasses(filtro.id)}
              onClick={() => setFiltroActivo(filtro.id)}
            >
              {filtro.label}
            </button>
          ))}
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
                  Marca/Modelo
                </th>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Problema
                </th>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Ingreso
                </th>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Est. Salida
                </th>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Costo
                </th>
                <th className="px-6 py-3 text-left text-[oklch(0.98_0_0)]">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[oklch(0.3_0.12_25)]">
              {reparaciones.map((reparacion) => (
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
                    {reparacion.problema}
                  </td>
                  <td className="px-6 py-4">
                    <span className={getBadgeClasses(reparacion.estado)}>
                      {reparacion.estado.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[oklch(0.98_0_0)]">
                    {reparacion.fechaIngreso}
                  </td>
                  <td className="px-6 py-4 text-[oklch(0.98_0_0)]">
                    {reparacion.fechaEstimada}
                  </td>
                  <td className="px-6 py-4 text-[oklch(0.98_0_0)]">
                    ${reparacion.costo}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerDetalles(reparacion)}
                        className="p-2 hover:bg-[oklch(0.3_0.12_25)] rounded-lg"
                      >
                        <FaEye className="text-[oklch(0.98_0_0)]" />
                      </button>
                      <button className="p-2 hover:bg-[oklch(0.3_0.12_25)] rounded-lg">
                        <FaPencilAlt className="text-[oklch(0.98_0_0)]" />
                      </button>
                      <button className="p-2 hover:bg-[oklch(0.3_0.12_25)] rounded-lg">
                        <FaTrash className="text-[oklch(0.98_0_0)]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles */}
      {modalVisible && reparacionSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[oklch(0.25_0.12_25)] rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-[oklch(0.98_0_0)] mb-4">
              Detalles de la Reparación
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-400">Patente</h3>
                <p className="text-[oklch(0.98_0_0)]">
                  {reparacionSeleccionada.patente}
                </p>
              </div>
              <div>
                <h3 className="text-gray-400">Vehículo</h3>
                <p className="text-[oklch(0.98_0_0)]">
                  {reparacionSeleccionada.vehiculo}
                </p>
              </div>
              <div>
                <h3 className="text-gray-400">Cliente</h3>
                <p className="text-[oklch(0.98_0_0)]">
                  {reparacionSeleccionada.cliente}
                </p>
              </div>
              <div>
                <h3 className="text-gray-400">Estado</h3>
                <span
                  className={getBadgeClasses(reparacionSeleccionada.estado)}
                >
                  {reparacionSeleccionada.estado.replace("_", " ")}
                </span>
              </div>
              <div className="col-span-2">
                <h3 className="text-gray-400">Problema</h3>
                <p className="text-[oklch(0.98_0_0)]">
                  {reparacionSeleccionada.problema}
                </p>
              </div>
              <div>
                <h3 className="text-gray-400">Fecha de Ingreso</h3>
                <p className="text-[oklch(0.98_0_0)]">
                  {reparacionSeleccionada.fechaIngreso}
                </p>
              </div>
              <div>
                <h3 className="text-gray-400">Fecha Estimada</h3>
                <p className="text-[oklch(0.98_0_0)]">
                  {reparacionSeleccionada.fechaEstimada}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalVisible(false)}
                className="px-4 py-2 border border-[oklch(0.65_0.22_25)] text-[oklch(0.98_0_0)] rounded-lg hover:bg-[oklch(0.3_0.12_25)]"
              >
                Cerrar
              </button>
              <button className="px-4 py-2 bg-[oklch(0.65_0.22_25)] text-[oklch(0.98_0_0)] rounded-lg hover:bg-[oklch(0.55_0.22_25)]">
                Cambiar Estado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReparacionesMecanico;
