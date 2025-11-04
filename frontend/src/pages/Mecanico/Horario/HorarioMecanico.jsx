import React, { useState } from "react";
import "./HorarioMecanico.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const HorarioMecanico = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("day"); // 'day' or 'month'

  // Datos de ejemplo
  const dailyStats = {
    total: 5,
    completadas: 3,
    enProgreso: 2,
  };

  const eventos = [
    {
      id: 1,
      hora: "08:00",
      servicio: "Cambio de aceite",
      vehiculo: "Ford Focus",
      cliente: "Juan Pérez",
      estado: "completada",
    },
    {
      id: 2,
      hora: "10:30",
      servicio: "Diagnóstico eléctrico",
      vehiculo: "Toyota Corolla",
      cliente: "María López",
      estado: "en_progreso",
    },
    {
      id: 3,
      hora: "14:00",
      servicio: "Revisión de frenos",
      vehiculo: "Volkswagen Gol",
      cliente: "Carlos Ruiz",
      estado: "pendiente",
    },
  ];

  const getEstadoColor = (estado) => {
    const colores = {
      completada: "green",
      en_progreso: "orange",
      pendiente: "yellow",
    };
    return colores[estado] || "gray";
  };

  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    ).getDate();
    const firstDayOfMonth = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    ).getDay();

    const calendar = [];
    const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    // Headers de los días de la semana
    const headerRow = weekDays.map((day, index) => (
      <div key={index} className="text-center text-gray-400 py-2">
        {day}
      </div>
    ));
    calendar.push(
      <div key="header" className="grid grid-cols-7 mb-2">
        {headerRow}
      </div>
    );

    // Grid de días
    let days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === new Date().getMonth() &&
        selectedDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={`p-2 text-center cursor-pointer rounded-lg transition-colors ${
            isToday
              ? "bg-[oklch(0.65_0.22_25)] text-[oklch(0.98_0_0)]"
              : "text-[oklch(0.98_0_0)] hover:bg-[oklch(0.3_0.12_25)]"
          }`}
          onClick={() =>
            setSelectedDate(
              new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
            )
          }
        >
          {day}
        </div>
      );
    }

    calendar.push(
      <div key="days" className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );

    return calendar;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Calendar */}
        <div className="bg-[oklch(0.25_0.12_25)] p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => {
                const prevMonth = new Date(selectedDate);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                setSelectedDate(prevMonth);
              }}
              className="p-2 hover:bg-[oklch(0.3_0.12_25)] rounded-lg"
            >
              <FaChevronLeft className="text-[oklch(0.98_0_0)]" />
            </button>
            <h2 className="text-[oklch(0.98_0_0)] font-bold">
              {selectedDate.toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={() => {
                const nextMonth = new Date(selectedDate);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setSelectedDate(nextMonth);
              }}
              className="p-2 hover:bg-[oklch(0.3_0.12_25)] rounded-lg"
            >
              <FaChevronRight className="text-[oklch(0.98_0_0)]" />
            </button>
          </div>
          {renderCalendar()}
        </div>

        {/* Daily Stats */}
        <div className="bg-[oklch(0.25_0.12_25)] p-4 rounded-lg">
          <h3 className="text-[oklch(0.98_0_0)] font-bold mb-4">
            Resumen del Día
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Total de tareas</span>
                <span className="text-[oklch(0.98_0_0)]">
                  {dailyStats.total}
                </span>
              </div>
              <div className="w-full bg-[oklch(0.15_0_0)] rounded-full h-2">
                <div
                  className="bg-[oklch(0.65_0.22_25)] h-2 rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Completadas</span>
                <span className="text-green-500">{dailyStats.completadas}</span>
              </div>
              <div className="w-full bg-[oklch(0.15_0_0)] rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      (dailyStats.completadas / dailyStats.total) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">En progreso</span>
                <span className="text-orange-500">{dailyStats.enProgreso}</span>
              </div>
              <div className="w-full bg-[oklch(0.15_0_0)] rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{
                    width: `${
                      (dailyStats.enProgreso / dailyStats.total) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[oklch(0.98_0_0)]">
              Mi Horario
            </h1>
            <p className="text-gray-400 mt-1">
              {selectedDate.toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-[oklch(0.65_0.22_25)] text-[oklch(0.98_0_0)] rounded-lg hover:bg-[oklch(0.55_0.22_25)]"
            >
              Hoy
            </button>
            <button
              onClick={handlePrevDay}
              className="p-2 border border-[oklch(0.3_0.12_25)] rounded-lg hover:bg-[oklch(0.3_0.12_25)]"
            >
              <FaChevronLeft className="text-[oklch(0.98_0_0)]" />
            </button>
            <button
              onClick={handleNextDay}
              className="p-2 border border-[oklch(0.3_0.12_25)] rounded-lg hover:bg-[oklch(0.3_0.12_25)]"
            >
              <FaChevronRight className="text-[oklch(0.98_0_0)]" />
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-[oklch(0.25_0.12_25)] rounded-lg divide-y divide-[oklch(0.3_0.12_25)]">
          {eventos.length > 0 ? (
            eventos.map((evento) => (
              <div
                key={evento.id}
                className="p-4 hover:bg-[oklch(0.3_0.12_25)] transition-colors"
                style={{
                  borderLeft: `4px solid ${
                    evento.estado === "completada"
                      ? "#22c55e"
                      : evento.estado === "en_progreso"
                      ? "#f97316"
                      : "#eab308"
                  }`,
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="text-[oklch(0.98_0_0)] font-medium w-16">
                      {evento.hora}
                    </div>
                    <div>
                      <h3 className="text-[oklch(0.98_0_0)] font-medium">
                        {evento.servicio}
                      </h3>
                      <p className="text-gray-400">
                        {evento.vehiculo} - {evento.cliente}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium text-${getEstadoColor(
                      evento.estado
                    )}-500 bg-${getEstadoColor(evento.estado)}-500/20`}
                  >
                    {evento.estado.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center text-gray-400">
                <span className="text-4xl mb-2">📅</span>
                <p>No hay eventos programados para este día</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorarioMecanico;
