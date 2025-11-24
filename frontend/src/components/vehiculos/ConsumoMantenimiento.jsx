import React, { useEffect, useState } from "react";
import { Droplet, Fuel, Star, Gauge, Car } from "lucide-react";
import { getConsumo } from "../../services/vehicleService";

const ConsumoMantenimiento = ({ vehiculoId, compact = false }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getConsumo(vehiculoId)
      .then(setInfo)
      .catch((err) => setError(err.message || "Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [vehiculoId]);

  if (loading) return <p>Cargando consumo y mantenimiento...</p>;
  if (error) return <p>{error}</p>;
  if (!info) return null;

  return (
    <div className={`info-grid ${compact ? "compact" : ""}`}>
      <div className="info-lead">
        <div className="icon"><Car size={18} /></div>
      </div>

      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon"><Droplet size={16} /></div>
          <span className="info-value">{info.consumoPromedio} L/100km</span>
        </div>
        <span className="info-label">Consumo promedio</span>
      </div>

      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon"><Fuel size={16} /></div>
          <span className="info-value">{info.capacidadTanque} L</span>
        </div>
        <span className="info-label">Capacidad tanque</span>
      </div>

      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon"><Star size={16} /></div>
          <span className="info-value">{info.serviceRecomendado} km</span>
        </div>
        <span className="info-label">Service recomendado</span>
      </div>

      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon"><Gauge size={16} /></div>
          <span className="info-value">{info.kilometrajeActual} km</span>
        </div>
        <span className="info-label">Kilometraje actual</span>
      </div>
    </div>
  );
};

export default ConsumoMantenimiento;
