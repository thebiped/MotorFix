import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Edit2,
  Star,
  ThumbsUp,
  ThumbsDown,
  Heart,
  User, // Agregué un ícono para el avatar del mecánico
} from "lucide-react";
import "./PerfilCliente.css";
// Nota: 'banner' y las imágenes de perfil deben estar accesibles, asumo que las rutas son correctas.
import banner from "../../../assets/img/banner.png";

const PerfilCliente = () => {
  const [activeTab, setActiveTab] = useState("Informacion Personal");

  // Componente para una fila de información personal
  const InfoItem = ({ icon: Icon, value, label, onEdit }) => (
    <div className="profile-info-item">
      <div className="info-icon-container">
        <Icon size={20} className="info-icon" />
      </div>
      <div className="info-details">
        <p className="info-value">{value}</p>
        <p className="info-label">{label}</p>
      </div>
      <button
        className="edit-info-btn"
        onClick={onEdit}
        aria-label={`Editar ${label}`}
      >
        <Edit2 size={14} />
      </button>
    </div>
  );

  // Componente para un mecánico
  const InteractiveRating = ({ initialRating, maxStars = 5, mechanicId }) => {
    // Estado para el rating actual seleccionado por el usuario.
    const [rating, setRating] = useState(initialRating);
    // Estado para el hover (efecto visual al pasar el ratón)
    const [hover, setHover] = useState(0);

    const handleRatingClick = (newRating) => {
      setRating(newRating);
      // Aquí podrías llamar a una función para guardar el rating en el backend:
      // saveMechanicRating(mechanicId, newRating);
      console.log(
        `Mecánico ID: ${mechanicId} calificado con ${newRating} estrellas.`
      );
    };

    return (
      <div className="mechanic-rating interactive-rating-container">
        {Array.from({ length: maxStars }).map((_, i) => {
          const ratingValue = i + 1;
          return (
            <Star
              key={i}
              size={18} // Aumentado ligeramente para mejor interacción
              className="rating-star"
              // Determina si la estrella debe estar rellena (según hover o rating)
              fill={ratingValue <= (hover || rating) ? "#FFD700" : "none"}
              stroke={
                ratingValue <= (hover || rating) ? "#FFD700" : "currentColor"
              }
              // Handlers de interactividad
              onClick={() => handleRatingClick(ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            />
          );
        })}
      </div>
    );
  };

  const MechanicItem = ({
    name,
    specialty,
    lastService,
    rating,
    isFavorite = false,
    id,
  }) => (
    <div className="mechanic-item">
           {" "}
      <div className="mechanic-info">
               {" "}
        <div className="mechanic-avatar">
                    <User size={30} color="#370000" />       {" "}
        </div>
               {" "}
        <div className="mechanic-details">
                    <p className="mechanic-name">{name}</p>         {" "}
          {specialty && <p className="mechanic-specialty">{specialty}</p>}     
             {" "}
          {lastService && (
            <p className="mechanic-last-service">
                            Último servicio: {lastService}           {" "}
            </p>
          )}
                    {/* Rating Interactivo */}
                    <InteractiveRating initialRating={rating} mechanicId={id} />
                   {" "}
          {/* ELIMINADO: Contenedor .mechanic-actions con ThumbsUp, ThumbsDown y Heart */}
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      <div className="mechanic-buttons">
                <button className="consult-btn">Consultar</button>     {" "}
      </div>
         {" "}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Informacion Personal":
        return (
          <div className="profile-personal-info-content">
            <InfoItem
              icon={Mail}
              value="usuario@gmail.com"
              label="Correo Electrónico"
              onEdit={() => console.log("Editar Correo")}
            />
            <InfoItem
              icon={Phone}
              value="+51 11 1234-5678"
              label="Número de Teléfono"
              onEdit={() => console.log("Editar Teléfono")}
            />
            <InfoItem
              icon={MapPin}
              value="Av. Corrientes 1234, CABA"
              label="Dirección / Localidad"
              onEdit={() => console.log("Editar Dirección")}
            />
          </div>
        );
      case "Seguridad":
        return (
          <div className="profile-security-content">
            <div className="security-item">
              <h4>Contraseña y autenticación</h4>
              <button className="change-password-btn">
                Cambiar Contraseña
              </button>
            </div>
            <div className="security-item">
              <h4>Remover cuenta</h4>
              <p>
                Desactivar tu cuenta significaría que la inhabilitarías por un
                tiempo.
              </p>
              <div className="security-actions-container">
                <button className="deactivate-account-btn">
                  Desactivar Cuenta
                </button>
                <button className="delete-account-btn">Eliminar Cuenta</button>
              </div>
            </div>
          </div>
        );
      case "Contactos de Taller":
        return (
          <div className="profile-workshop-contacts-content">
                        <h4>Mecánicos con los que trabajaste</h4>           {" "}
            <MechanicItem
              name="Mecánico A (Trabajado)"
              specialty="Mecánico especialista"
              lastService="14/04/2025"
              rating={5} // Puntuación inicial
              id="mech-a" // ID ficticia
            />
                       {" "}
            <MechanicItem
              name="Mecánico B (Trabajado)"
              specialty="Mecánico especialista"
              lastService="14/04/2025"
              rating={4} // Puntuación inicial
              id="mech-b" // ID ficticia
            />
                       {" "}
            <h4 className="favorites-separator">Mecánicos Favoritos</h4>       
               {" "}
            <MechanicItem
              name="Mecánico C (Favorito)"
              rating={5}
              isFavorite={true}
              id="mech-c" // ID ficticia
            />
                     {" "}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="perfil-cliente-container">
      <div className="profile-header">
        <div className="profile-banner">
          {/* Se usa un img tag para mostrar el banner si es necesario, 
            aunque en el CSS base se usa como background-image. 
            Lo dejo así para ser fiel a tu código original de JSX. */}
          <img src={banner} alt="Banner de Perfil" />
        </div>

        {/* Contenedor principal de foto e info para un mejor posicionamiento */}
        <div className="profile-info-and-picture">
          <div className="profile-picture-container">
            {/* Asumo que tienes una imagen real, pero uso un div para replicar el estilo de placeholder */}
            <div className="profile-picture">
              {/* Placeholder de imagen de perfil */}
            </div>
          </div>
          <div className="profile-header-info">
            <div className="header-info">
              <div className="info">
                <h2>Usuario C</h2>
                <span className="user-role">Cliente</span>
              </div>
              <button className="edit-profile-btn">Editar perfil</button>
            </div>
            <p className="profile-description">
              lorem ipsum dolor sit amet consectetur adipiscing elit dis
              dignissim sociis libero class, euismod blandit semper metus
              sollicitudin at vehicula turpis lobortis per facilisis.
            </p>
          </div>
        </div>
      </div>

      <div className="profile-content-section">
        <div className="profile-stats-container">
          <div className="profile-stats">
            <div className="stat-item">
              <h3>$106.500</h3>
              <p>Gasto Total</p>
            </div>
            <div className="stat-item">
              <h3>12</h3>
              <p>Total de Servicios</p>
            </div>
            <div className="stat-item">
              <h3>4.8/5.0</h3> {/* Corregí el valor a algo más lógico */}
              <p>Satisfacción Promedio</p>
            </div>
          </div>
        </div>

        <div className="profile-nav">
          <button
            onClick={() => setActiveTab("Informacion Personal")}
            className={activeTab === "Informacion Personal" ? "active" : ""}
          >
            Información Personal
          </button>
          <button
            onClick={() => setActiveTab("Seguridad")}
            className={activeTab === "Seguridad" ? "active" : ""}
          >
            Seguridad
          </button>
          <button
            onClick={() => setActiveTab("Contactos de Taller")}
            className={activeTab === "Contactos de Taller" ? "active" : ""}
          >
            Contactos de Taller
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-content-cont">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default PerfilCliente;
