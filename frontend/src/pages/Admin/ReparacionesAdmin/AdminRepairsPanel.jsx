import React, { useState, useEffect, useMemo } from "react";
import {
  FaUserCog,
  FaWrench,
  FaTools,
  FaCarCrash,
  FaClipboardList,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { IoMdSpeedometer } from "react-icons/io";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import "./AdminRepairsPanel.css";

const API_URL_BASE = "http://localhost:3001";
const API_URL_REPAIRS = `${API_URL_BASE}/api/turnos/all`;
const API_URL_DIAGNOSTICO = `${API_URL_BASE}/api/turnos/diagnostico/`;

// Placeholder para la imagen del auto sin imagen
const PLACEHOLDER_CAR =
  "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect fill='%23000' width='100%25' height='100%25'/><text x='50%25' y='50%25' font-size='18' fill='%23ff2a2a' alignment-baseline='middle' text-anchor='middle'>VEHÍCULO NO CARGADO</text></svg>";

// Helper para agrupar por mecánico
const groupRepairsByMechanic = (repairs) => {
  return repairs.reduce((acc, repair) => {
    // Si el mecánico es null o undefined, lo manejamos como "SIN ASIGNAR"
    const mechanic = repair.mecanico || {
      id: "UNASSIGNED",
      name: "SIN ASIGNAR",
      role: "Mecánico", // Default
      specialty: "General", // Default
    };
    const mechanicId = mechanic.id;

    if (!acc[mechanicId]) {
      acc[mechanicId] = {
        id: mechanicId,
        name: mechanic.name,
        role: mechanic.role,
        specialty: mechanic.specialty,
        repairs: [],
      };
    }
    acc[mechanicId].repairs.push(repair);
    return acc;
  }, {});
};

// Componente principal para el Administrador
const AdminRepairsPanel = () => {
  const { userId } = useOutletContext(); // Contexto del usuario logueado

  // Estado principal de la aplicación
  const [allRepairs, setAllRepairs] = useState([]); // Todas las reparaciones/turnos
  const [selectedMechanic, setSelectedMechanic] = useState(null); // Mecánico seleccionado
  const [selectedRepair, setSelectedRepair] = useState(null); // Reparación seleccionada para ver detalles
  const [loading, setLoading] = useState(true);
  const [isNotesSliderOpen, setIsNotesSliderOpen] = useState(false); // Slider para ver notas
  const [currentRepairIndex, setCurrentRepairIndex] = useState(0); // Índice de la reparación actual (CENTRAL)
  const [currentMechanicIndex, setCurrentMechanicIndex] = useState(0); // Índice del mecánico actual (IZQUIERDO)

  // ===================================
  // 1. LÓGICA DE OBTENCIÓN DE DATOS (Fetch Real de TODOS los turnos)
  // ===================================
  const fetchAllRepairs = async () => {
    setLoading(true);
    try {
      // 🛑 CAMBIO CLAVE: Llamada al endpoint real del backend
      const response = await axios.get(API_URL_REPAIRS);

      const data = response.data;

      // La respuesta del backend ya viene en el formato que el frontend espera
      // (gracias al mapeo que hicimos en la ruta '/turnos/all').
      setAllRepairs(data);
    } catch (err) {
      console.error("❌ Error al obtener los datos de administración:", err);
      // En caso de fallo de conexión/API, la lista queda vacía
      setAllRepairs([]);
      alert("Error de conexión con el Backend. Mostrando lista vacía.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRepairs();
  }, []);

  // ===================================
  // 2. LÓGICA DE GUARDAR DIAGNÓSTICO (PUT /turnos/diagnostico/:id)
  // ===================================
  // Esta función llama al backend para guardar el diagnóstico.
  const saveDiagnostics = async (id_turno, data) => {
    try {
      const response = await axios.put(
        `${API_URL_BASE}/api/turnos/diagnostico/${id_turno}`, 
        data
      );

      if (response.data.success || response.data.message) {
        alert("Diagnóstico guardado con éxito.");
        // Refrescar la lista de reparaciones para ver el cambio
        fetchAllRepairs();
      }
    } catch (error) {
      console.error("Error al guardar diagnóstico:", error);
      alert(
        "Error al guardar diagnóstico. Revisa la consola y el estado del backend."
      );
    }
  };

  // Agrupamos las reparaciones por mecánico y generamos la lista ordenada
  const repairsByMechanic = useMemo(
    () => groupRepairsByMechanic(allRepairs),
    [allRepairs]
  );
  const mechanicsList = useMemo(
    () =>
      Object.values(repairsByMechanic).sort((a, b) => {
        // Priorizar 'SIN ASIGNAR' al final
        if (a.id === "UNASSIGNED") return 1;
        if (b.id === "UNASSIGNED") return -1;
        return a.name.localeCompare(b.name);
      }),
    [repairsByMechanic]
  );

  // ===================================
  // 3. LÓGICA DE NAVEGACIÓN (SLIDERS)
  // ===================================

  // ** Navegación de Tareas (Panel Central) **
  const navigateRepair = (direction) => {
    if (!selectedMechanic || selectedMechanic.repairs.length === 0) return;

    let newIndex = currentRepairIndex + direction;

    // Asegurar que el índice esté dentro de los límites (navegación circular)
    const maxIndex = selectedMechanic.repairs.length - 1;

    if (newIndex < 0) {
      newIndex = maxIndex; // Volver al final
    } else if (newIndex > maxIndex) {
      newIndex = 0; // Volver al principio
    }

    const newSelectedRepair = selectedMechanic.repairs[newIndex];
    if (newSelectedRepair) {
      setSelectedRepair(newSelectedRepair);
      setCurrentRepairIndex(newIndex);
      setIsNotesSliderOpen(false); // Cerrar slider al navegar
    }
  };

  // ** Navegación de Mecánicos (Panel Izquierdo) **
  const navigateMechanic = (direction) => {
    if (mechanicsList.length === 0) return;

    let newIndex = currentMechanicIndex + direction;
    const maxIndex = mechanicsList.length - 1;

    // Navegación circular
    if (newIndex < 0) {
      newIndex = maxIndex;
    } else if (newIndex > maxIndex) {
      newIndex = 0;
    }

    const newMechanic = mechanicsList[newIndex];
    if (newMechanic) {
      selectMechanic(newMechanic, newIndex); // Llama a selectMechanic con el nuevo índice
    }
  };

  // ===================================
  // 4. LÓGICA DE SELECCIÓN Y GESTIÓN DE PANELES
  // ===================================

  const selectMechanic = (mechanic, indexOverride = null) => {
    setSelectedMechanic(mechanic);
    // Establecer el índice actual del mecánico, usando el override si está presente
    setCurrentMechanicIndex(
      indexOverride !== null
        ? indexOverride
        : mechanicsList.findIndex((m) => m.id === mechanic.id)
    );

    // Selecciona la primera reparación del nuevo mecánico, si existe
    const firstRepair =
      mechanic.repairs.length > 0 ? mechanic.repairs[0] : null;
    setSelectedRepair(firstRepair);
    setCurrentRepairIndex(firstRepair ? 0 : 0);
    setIsNotesSliderOpen(false); // Cerrar slider de notas
  };

  const selectRepair = (repair) => {
    setSelectedRepair(repair);
    setIsNotesSliderOpen(false); // Cerrar slider de notas

    // Encontrar el índice de la reparación seleccionada
    if (selectedMechanic && repair) {
      const index = selectedMechanic.repairs.findIndex(
        (r) => r.id === repair.id
      );
      setCurrentRepairIndex(index !== -1 ? index : 0);
    } else {
      setCurrentRepairIndex(0);
    }
  };

  const closeDetail = () => {
    setSelectedRepair(null); // Solo cerramos el detalle
    setIsNotesSliderOpen(false);
  };

  // Función para abrir/cerrar el historial de notas
  const toggleNotesSlider = () => {
    if (selectedRepair) {
      setIsNotesSliderOpen((prev) => !prev);
    }
  };

  // ===================================
  // 5. RENDERIZADO DE COMPONENTES DE VISTA
  // ===================================

  // ** Componente: Bloque de Mecánico (Panel Izquierdo) **
  const MechanicBlock = ({ mechanic }) => {
    const isSelected = selectedMechanic?.id === mechanic.id;
    const isUnassigned = mechanic.id === "UNASSIGNED";

    // Referencia para el scroll
    const blockRef = React.useRef(null);

    useEffect(() => {
      if (isSelected && blockRef.current) {
        blockRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, [isSelected]);

    // Lógica para determinar el estado del mecánico
    const isActive = mechanic.repairs.some((r) => r.estado === "en proceso");
    const isPending = mechanic.repairs.some((r) => r.estado === "pendiente");

    let statusText = "DESOCUPADO";
    let statusClass = "completed"; // Default si solo hay completadas o ninguna
    if (isUnassigned) {
      statusText = "SIN ASIGNAR";
      statusClass = "unassigned";
    } else if (isActive) {
      statusText = "TRABAJANDO";
      statusClass = "active";
    } else if (isPending) {
      statusText = "EN ESPERA";
      statusClass = "pending";
    }

    return (
      <div
        ref={blockRef} // Agregamos la referencia
        key={mechanic.id}
        className={`mechanic-block ${isSelected ? "selected-block" : ""}`}
        onClick={() => selectMechanic(mechanic)}
      >
        <div className="block-header">
          <span className="mechanic-name">{mechanic.name}</span>
          {mechanic.role && (
            <span className="mechanic-role-tag">{mechanic.role}</span>
          )}
        </div>
        <div className="block-body">
          <p className="mechanic-specialty">
            **Especialidad:** {mechanic.specialty || "No definida"}
          </p>
          <p className="tasks-count">
            Tareas Asignadas: **{mechanic.repairs.length}**
          </p>
          <p className={`status-indicator ${statusClass}`}>{statusText}</p>
        </div>
      </div>
    );
  };

  // ** Componente: Card de Reparación (Tarea) **
  const RepairCard = ({ repair }) => {
    const isSelected = selectedRepair?.id === repair.id;
    // Fallback a 'normal' si no hay prioridad
    const priorityClass = (repair.prioridad || "normal").toLowerCase();
    const isCompleted = repair.estado === "completado";
    const statusText = isCompleted ? "FINALIZADO" : repair.estado.toUpperCase();

    // Referencia para el scroll
    const cardRef = React.useRef(null);

    useEffect(() => {
      if (isSelected && cardRef.current) {
        cardRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, [isSelected]);

    return (
      <div
        ref={cardRef} // Agregamos la referencia
        className={`repair-card ${isSelected ? "selected-card" : ""} ${
          isCompleted ? "completed-card" : ""
        } priority-${priorityClass}`} // Añadida clase de prioridad
        onClick={() => selectRepair(repair)}
      >
        <div className="card-header">
          <span className="client-name">
            {repair.user?.name || "CLIENTE DESCONOCIDO"}
          </span>
          {/* Badge de Estado/Prioridad más visible */}
          <span className={`status-badge ${repair.estado.replace(/\s/g, "-")}`}>
            {statusText}
          </span>
        </div>
        <div className="card-body">
          <p className="problem-summary">
            **Problema:** {repair.turno?.descripcion || "N/A"}
          </p>
          <p className="car-info">
            **Vehículo:** {repair.car?.brand || "Varios Modelo"} (
            {repair.car?.patente || "NAA"})
          </p>
        </div>
        <div className="card-footer">
          <span className="assigned-mechanic">
            Asignado a: {repair.mecanico?.name || "SIN ASIGNAR"}
          </span>
          {/* Badge de prioridad en el footer para contraste */}
          <span className={`priority-level-tag priority-${priorityClass}`}>
            Prioridad: {priorityClass.toUpperCase()}
          </span>
        </div>
      </div>
    );
  };

  // ** Componente: Detalle de Reparación **
  const RepairDetailView = ({ repair }) => {
    // Aquí puedes añadir más lógica si necesitas guardar el diagnóstico
    // por ejemplo, con inputs y un botón que llame a `saveDiagnostics(repair.id, {datos})`

    return (
      <div className="right-panel-content">
        <div className="rp-header">
          <span className="brand-tag">TAREA ID: {repair.id}</span>
          <h1 className="model-title">
            {repair.car?.brand || "VEHÍCULO"}{" "}
            {repair.car?.model || "DESCONOCIDO"}
          </h1>
          <p className="mechanic-name-header">
            **Mecánico Asignado:** {repair.mecanico?.name || "SIN ASIGNAR"}
          </p>
        </div>

        <div className="rp-body">
          {/* --- Contenedor de la Imagen --- */}
          <div className="car-display-area">
            <img
              src={
                repair.car?.image_url ||
                repair.car?.image_path ||
                PLACEHOLDER_CAR
              }
              alt="Car"
              className="main-car-img"
            />
          </div>
          {/* --- Fin de Imagen --- */}

          {/* Tarjeta de Detalles */}
          <div className="details-card">
            <h3>DETALLES DEL TURNO</h3>

            <div className="detail-row">
              <span className="label">Cliente:</span>
              <span className="value">
                {repair.user?.name || "Desconocido"}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Problema Reportado:</span>
              <span className="value problem-desc">
                {repair.turno?.descripcion || "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Tipo de Reparación:</span>
              <span className="value type-highlight">
                {repair.tipo_reparacion || "No especificado"}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Estado Actual:</span>
              <span
                className={`value status-highlight status-${repair.estado?.replace(
                  /\s/g,
                  "-"
                )}`}
              >
                {repair.estado?.toUpperCase() || "N/A"}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Patente / ID:</span>
              <span className="value">
                {repair.car?.patente || "N/A"} / {repair.id || "N/A"}
              </span>
            </div>
            <hr className="detail-divider" />
            <div className="detail-row">
              <span className="label">Prioridad:</span>
              <span
                className={`value priority-level-tag priority-${(
                  repair.prioridad || "normal"
                ).toLowerCase()}`}
              >
                {repair.prioridad?.toUpperCase() || "NORMAL"}
              </span>
            </div>
          </div>
        </div>

        {/* --- FOOTER DE DETALLE (Botones Simplificados) --- */}
        <div className="rp-footer">
          {/* Stats del Vehículo (simulado) */}
          <div className="stats-group">
            <div className="stat-box">
              <span className="stat-label">
                <IoMdSpeedometer /> VELOCIDAD MÁX.
              </span>
              {/* Estos valores no vinieron en tu mapeo de BD, se usan placeholders o los valores si los mapeas */}
              <span className="stat-num">
                220<small>km/h</small>
              </span>
            </div>
            <div className="stat-box">
              <span className="stat-label">
                <FaCarCrash /> KMS. RECORRIDOS
              </span>
              <span className="stat-num">
                {repair.car?.kilometraje || "150,000"}
                <small>km</small>
              </span>
            </div>
            <div className="stat-box">
              <span className="stat-label">CONSUMO PROM.</span>
              <span className="stat-num">
                9.5<small>L/100km</small>
              </span>
            </div>
          </div>

          <div className="buttons-group">
            {/* Botón CERRAR DETALLE (Más ancho) */}
            <button className="hud-btn back" onClick={closeDetail}>
              CERRAR DETALLE
            </button>
            {/* Botón VER DIAGNÓSTICO */}
            <button className="hud-btn diag" onClick={toggleNotesSlider}>
              VER DIAGNÓSTICO
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ** Componente: Slider de Notas de Diagnóstico (Admin View) **
  const NotesSlider = ({ repair }) => {
    const notes = [
      {
        id: 1,
        fecha: "N/A",
        autor: repair.mecanico?.name || "N/A",
        titulo: "Observación Inicial",
        // 🛑 Usamos los datos reales del backend
        contenido:
          repair.diagnostico_observacion_inicial ||
          "Pendiente de registro por el mecánico.",
        icon: <FaCarCrash />,
      },
      {
        id: 2,
        fecha: "N/A",
        autor: repair.mecanico?.name || "N/A",
        titulo: "Resultados de Escáner",
        // 🛑 Usamos los datos reales del backend
        contenido:
          repair.diagnostico_resultados_scanner ||
          "Pendiente de registro por el mecánico.",
        icon: <FaWrench />,
      },
      {
        id: 3,
        fecha: "N/A",
        autor: repair.mecanico?.name || "N/A",
        titulo: "Acciones Recomendadas/Realizadas",
        // 🛑 Usamos los datos reales del backend
        contenido:
          repair.diagnostico_acciones_recomendadas ||
          "Pendiente de registro por el mecánico.",
        icon: <FaTools />,
      },
    ];

    return (
      <div className={`diagnostics-panel ${isNotesSliderOpen ? "open" : ""}`}>
        <div className="dp-header">
          <h2>
            <FaClipboardList /> HISTORIAL DE DIAGNÓSTICO
          </h2>
          <button className="hud-btn close-diag" onClick={toggleNotesSlider}>
            CERRAR [X]
          </button>
        </div>

        <div className="dp-body">
          <p className="detail-info">
            **Tarea ID:** {repair.id} | **Vehículo:** {repair.car?.brand}{" "}
            {repair.car?.model}
          </p>
          <hr className="dp-divider" />

          <div className="notes-history">
            {notes.map((note) => (
              <div key={note.id} className="note-entry">
                <div className="note-header">
                  <span className="note-icon">{note.icon}</span>
                  <h4>{note.titulo}</h4>
                </div>
                <span className="note-date">
                  {note.fecha} por {note.autor}
                </span>
                <div className="note-content">
                  <p>{note.contenido}</p>
                </div>
              </div>
            ))}
            <p className="empty-list-message">
              **NOTA:** La información de diagnóstico se basa en los campos
              guardados del turno.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ===================================
  // 6. RENDERIZADO PRINCIPAL
  // ===================================
  return (
    <div className="hud-container-reparacion admin-mode">
      {/* LOADER */}
      {loading && (
        <div className="hud-loader-overlay">
          <div className="hud-loader-box">
            <div className="hud-loader-title">LOADING DATA FROM BACKEND...</div>
            <div className="hud-progress-bar">
              <div className="hud-progress-fill"></div>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* PANEL IZQUIERDO (LISTA DE MECÁNICOS) */}
          <div className="hud-panel left-panel mechanic-list">
            <div className="repair-lists-wrapper">
              <div className="list-section">
                <div className="panel-decor top-left"></div>
                <div className="panel-decor bottom-left"></div>

                <h2 className="panel-title">
                  <FaUserCog /> LISTA DE MECÁNICOS
                </h2>

                {/* BOTÓN ARRIBA (Anterior Mecánico) - Nuevo */}
                <button
                  className="hud-btn nav-arrow nav-up center-nav-btn top left-nav-btn"
                  onClick={() => navigateMechanic(-1)}
                  disabled={mechanicsList.length <= 1}
                >
                  <FaChevronUp />
                </button>

                <div className="repair-list-scroll">
                  {mechanicsList.length === 0 && (
                    <p className="empty-list-message">
                      No hay mecánicos o tareas asignadas para mostrar.
                    </p>
                  )}
                  {mechanicsList.map((m) => (
                    <MechanicBlock key={m.id} mechanic={m} />
                  ))}
                </div>

                {/* BOTÓN ABAJO (Siguiente Mecánico) - Nuevo */}
                <button
                  className="hud-btn nav-arrow nav-down center-nav-btn bottom left-nav-btn"
                  onClick={() => navigateMechanic(1)}
                  disabled={mechanicsList.length <= 1}
                >
                  <FaChevronDown />
                </button>
              </div>
            </div>
          </div>

          {/* PANEL CENTRAL (REPARACIONES DEL MECÁNICO SELECCIONADO) */}
          <div className="hud-panel center-panel">
            <div className="panel-decor top-right"></div>
            <div className="panel-decor bottom-right"></div>
            <div className="panel-decor bottom-left"></div> {/* Extra Decor */}
            <div className="panel-decor top-left"></div> {/* Extra Decor */}
            {!selectedMechanic ? (
              <div className="empty-message">
                SELECCIONE UN MECÁNICO PARA VER SUS TAREAS
              </div>
            ) : (
              <div className="center-panel-content">
                <h2 className="panel-title">
                  TAREAS DE: {selectedMechanic.name}
                </h2>

                {/* BOTÓN ARRIBA (Anterior Tarea) */}
                <button
                  className="hud-btn nav-arrow nav-up center-nav-btn top"
                  onClick={() => navigateRepair(-1)}
                  disabled={selectedMechanic.repairs.length <= 1}
                >
                  <FaChevronUp />
                </button>

                <div className="repair-list-scroll">
                  {selectedMechanic.repairs.length === 0 ? (
                    <div className="empty-message-small">
                      Este mecánico no tiene reparaciones en proceso.
                    </div>
                  ) : (
                    selectedMechanic.repairs.map((r) => (
                      <RepairCard key={r.id} repair={r} />
                    ))
                  )}
                </div>

                {/* BOTÓN ABAJO (Siguiente Tarea) */}
                <button
                  className="hud-btn nav-arrow nav-down center-nav-btn bottom"
                  onClick={() => navigateRepair(1)}
                  disabled={selectedMechanic.repairs.length <= 1}
                >
                  <FaChevronDown />
                </button>
              </div>
            )}
          </div>

          {/* PANEL DERECHO (DETALLE DE LA REPARACIÓN SELECCIONADA) */}
          <div
            className={`hud-panel right-panel detail-panel ${
              selectedRepair ? "active" : ""
            }`}
          >
            <div className="panel-decor top-right"></div>
            <div className="panel-decor bottom-right"></div>

            {selectedRepair ? (
              <RepairDetailView repair={selectedRepair} />
            ) : (
              <div className="empty-message">
                SELECCIONE UNA TAREA PARA VER DETALLES DEL VEHÍCULO
              </div>
            )}
          </div>

          {/* SLIDER DE NOTAS DE DIAGNÓSTICO */}
          {selectedRepair && <NotesSlider repair={selectedRepair} />}
        </>
      )}
    </div>
  );
};

export default AdminRepairsPanel;
