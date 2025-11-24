import React, { useEffect, useState } from "react";
import { Gauge, Zap, Cog, Palette, Car, ScanLine } from "lucide-react";
import { getBasica } from "../../services/vehicleService";

const InformacionBasica = ({ vehiculoId, compact = false }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getBasica(vehiculoId)
      .then(setInfo)
      .catch((err) => setError(err.message || "Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [vehiculoId]);

  if (loading) return <p>Cargando información básica...</p>;
  if (error) return <p>{error}</p>;
  if (!info) return null;

  return (
    <div className={`info-grid ${compact ? "compact" : ""}`}>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon"><Gauge size={20} /></div>
          <span className="info-value">{info.velocidadMax} km/h</span>
        </div>
        <span className="info-label">Velocidad máxima</span>
      </div>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon"><Zap size={20} /></div>
          <span className="info-value">{info.aceleracion} s</span>
        </div>
        <span className="info-label">0 a 100 km/h</span>
      </div>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon"><Cog size={20} /></div>
          <span className="info-value">{info.potencia} hp</span>
        </div>
        <span className="info-label">Potencia máxima</span>
      </div>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon"><Car size={20} /></div>
          <span className="info-value">{info.transmision}</span>
        </div>
        <span className="info-label">Transmisión</span>
      </div>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon"><Palette size={20} /></div>
          <span className="info-value">{info.color}</span>
        </div>
        <span className="info-label">Color base</span>
      </div>
      <div className="info-item">
        <div className="info-item-primary">
          <div className="icon"><ScanLine size={20} /></div>
          <span className="info-value">{info.patente}</span>
        </div>
        <span className="info-label">Patente</span>
      </div>
    </div>
  );
};

export default InformacionBasica;
