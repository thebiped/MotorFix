import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "./TurnosCliente.css";

const StatusPill = ({ status }) => {
  const cls =
    status === "Pendiente"
      ? "pill pending"
      : status === "Completado"
      ? "pill done"
      : "pill progress";

  return <div className={cls}>{status}</div>;
};

const TurnosCliente = () => {
  // userId desde Outlet o localStorage
  const outlet = useOutletContext?.() ?? {};
  const outletUserId = outlet?.userId;
  const [editTurno, setEditTurno] = useState(null);

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
      return null;
    }
  })();

  const userId =
    outletUserId ?? storedUser?.id ?? storedUser?.id_usuario ?? null;

  const [turnos, setTurnos] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [problema, setProblema] = useState("");
  const [tipoReparacion, setTipoReparacion] = useState("");
  const [vehiculoId, setVehiculoId] = useState("");

  useEffect(() => {
    console.log("[TurnosCliente] effective userId:", userId);
  }, [userId]);

  // Cargar turnos del usuario
  useEffect(() => {
    if (!userId) {
      setTurnos([]);
      return;
    }

    const url = `http://localhost:3001/api/turnos/user/${userId}`;
    console.log("[TurnosCliente] fetching turnos from", url);

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        console.log("[TurnosCliente] turnos response:", data);
        setTurnos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching turnos:", err);
        setTurnos([]);
      });
  }, [userId]);

  // Cargar vehículos del usuario
  useEffect(() => {
    if (!userId) {
      setVehiculos([]);
      return;
    }

    const url = `http://localhost:3001/api/vehiculos/user/${userId}`;
    console.log("[TurnosCliente] fetching vehiculos from", url);

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        console.log("[TurnosCliente] vehiculos response:", data);
        setVehiculos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching vehiculos:", err);
        setVehiculos([]);
      });
  }, [userId]);

  const handleCrearTurno = async () => {
    if (!vehiculoId || !problema || !tipoReparacion) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/turnos/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          vehicle_id: vehiculoId,
          problema,
          tipo_reparacion: tipoReparacion,
        }),
      });

      const data = await res.json();
      console.log("[TurnosCliente] create turno response:", data);

      if (data.success) {
        alert("Turno creado");

        // refrescar lista
        const lista = await fetch(
          `http://localhost:3001/api/turnos/user/${userId}`
        ).then((r) => r.json());

        setTurnos(Array.isArray(lista) ? lista : []);

        setShowModal(false);
        setProblema("");
        setTipoReparacion("");
        setVehiculoId("");
      } else {
        alert(
          "Error: " + (data.error || data.message || "respuesta sin éxito")
        );
      }
    } catch (err) {
      console.error("Error al crear turno:", err);
      alert("Error al conectar con el servidor");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este turno?")) return;

    try {
      const res = await fetch(`http://localhost:3001/api/turnos/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Turno eliminado");

        const lista = await fetch(
          `http://localhost:3001/api/turnos/user/${userId}`
        ).then((r) => r.json());

        setTurnos(Array.isArray(lista) ? lista : []);
      } else {
        alert("Error: " + (data.error || "No se pudo eliminar"));
      }
    } catch (e) {
      console.error(e);
      alert("Error al conectar con el servidor");
    }
  };

  const handleGuardarEdicion = async () => {
    if (!editTurno) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/turnos/${editTurno.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problema: editTurno.problema,
            tipo_reparacion: editTurno.tipo_reparacion,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Turno actualizado");

        const lista = await fetch(
          `http://localhost:3001/api/turnos/user/${userId}`
        ).then((r) => r.json());

        setTurnos(Array.isArray(lista) ? lista : []);
        setEditTurno(null);
      } else {
        alert("Error al actualizar: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error de servidor");
    }
  };

  // unifica marca/modelo con diferentes nombres según el backend
  const renderMarcaModelo = (v) => {
    const marca =
      v.marca ??
      v.brand ??
      v.nombre ??
      v.brand_name ??
      v.marca_nombre ??
      v.nombre_marca ??
      v.nombreBrand;

    const modelo =
      v.modelo ??
      v.model ??
      v.model_name ??
      v.nombre_modelo ??
      v.modelo_nombre ??
      v.nombreModel;

    const idModel = v.id_model ?? v.idModel ?? v.id_modelo ?? "";

    return `${marca ?? idModel ?? ""}${marca || idModel ? " " : ""}${
      modelo ?? ""
    }`.trim();
  };

  return (
    <div className="turnos-container">
      <div className="turnos-top">
        <h1>MIS TURNOS</h1>
        <p className="subtitle">Gestiona tus citas y servicios programados</p>
      </div>

      <div className="datos-vehiculos turnos-table-card">
        <div className="datos-header">
          <h2>TUS TURNOS</h2>
          <div className="datos-actions">
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              Nuevo Turno
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="turnos-table">
            <thead>
              <tr>
                <th></th>
                <th>Fecha</th>
                <th>Vehículo</th>
                <th>Tipo reparación</th>
                <th>Problema</th>
                <th>Estado</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {turnos.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: 16 }}>
                    No hay turnos
                  </td>
                </tr>
              )}
              {turnos.map((t) => (
                <tr key={t.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{t.fecha_creado}</td>
                  <td>
                    {t.patente
                      ? `${t.patente} — ${renderMarcaModelo(t)}`
                      : renderMarcaModelo(t)}
                  </td>
                  <td>{t.tipo_reparacion}</td>
                  <td>{t.problema}</td>
                  <td>
                    <StatusPill status={t.estado} />
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() =>
                        setEditTurno({
                          id: t.id,
                          problema: t.problema,
                          tipo_reparacion: t.tipo_reparacion,
                        })
                      }
                    >
                      ✏️
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleEliminar(t.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Nuevo Turno</h2>

            <div className="field">
              <label>Problema del vehículo</label>
              <input
                type="text"
                value={problema}
                onChange={(e) => setProblema(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Tipo de reparación</label>
              <select
                value={tipoReparacion}
                onChange={(e) => setTipoReparacion(e.target.value)}
              >
                <option value="">Seleccionar</option>
                <option value="mecanica">Mecánica</option>
                <option value="electrico">Eléctrico</option>
                <option value="service">Service</option>
                <option value="chapa">Chapa y pintura</option>
              </select>
            </div>

            <div className="field">
              <label>Vehículo</label>
              <select
                value={vehiculoId}
                onChange={(e) => setVehiculoId(e.target.value)}
              >
                <option value="">Seleccionar vehículo</option>
                {vehiculos.map((v) => {
                  const label = `${renderMarcaModelo(v)}${
                    v.patente ? ` - ${v.patente}` : ""
                  }`.trim();

                  return (
                    <option
                      key={v.id_vehiculo ?? v.id}
                      value={v.id_vehiculo ?? v.id}
                    >
                      {label || `vehículo #${v.id_vehiculo ?? v.id}`}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleCrearTurno}>
                Crear Turno
              </button>
            </div>
          </div>
        </div>
      )}
      {editTurno && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Editar Turno</h2>

            <div className="field">
              <label>Problema</label>
              <input
                type="text"
                value={editTurno.problema}
                onChange={(e) =>
                  setEditTurno({ ...editTurno, problema: e.target.value })
                }
              />
            </div>

            <div className="field">
              <label>Tipo Reparación</label>
              <select
                value={editTurno.tipo_reparacion}
                onChange={(e) =>
                  setEditTurno({
                    ...editTurno,
                    tipo_reparacion: e.target.value,
                  })
                }
              >
                <option value="">Seleccionar</option>
                <option value="mecanica">Mecánica</option>
                <option value="electrico">Eléctrico</option>
                <option value="service">Service</option>
                <option value="chapa">Chapa y pintura</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setEditTurno(null)}
              >
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleGuardarEdicion}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnosCliente;
