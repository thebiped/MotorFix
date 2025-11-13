import React, { useState } from 'react';
import './ModelSelector.css';

// Datos temporales de modelos
const models = {
  Toyota: [
    { name: 'Corolla 2021', image: '/src/assets/img/toyota-corolla.png' },
    { name: 'Hilux 2022', image: '/src/assets/img/honda-civic.png' }, // Placeholder image
    { name: 'Yaris 2020', image: '/src/assets/img/ford-focus.png' },   // Placeholder image
  ],
  // Agrega más marcas y modelos aquí si es necesario
};

const ModelSelector = ({ brand, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const brandModels = models[brand] || [];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % brandModels.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + brandModels.length) % brandModels.length);
  };

  if (brandModels.length === 0) {
    return (
      <div>
        <h2>No se encontraron modelos para {brand}</h2>
        <button onClick={onBack}>Volver</button>
      </div>
    );
  }

  return (
    <div className="model-selector">
      <div className="header-text">
        <h2>Selecciona Tu Modelo de Auto</h2>
      </div>
      <div className="slider-container">
        <button className="slider-arrow left" onClick={prevSlide}>&#10094;</button>
        <div className="slide">
          <div className="model-info">
            <h1>{brand}</h1>
            <p>{brandModels[currentIndex].name}</p>
          </div>
          <img src={brandModels[currentIndex].image} alt={brandModels[currentIndex].name} className="model-image" />
        </div>
        <button className="slider-arrow right" onClick={nextSlide}>&#10095;</button>
      </div>
      <div className="slider-dots">
        {brandModels.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
      <div className="form-and-actions">
        <div className="form-inputs">
          <label>Color</label>
          <select>
            <option>placeholder...</option>
          </select>
          <label>Patente</label>
          <input type="text" placeholder="placeholder..." />
        </div>
        <div className="action-buttons">
          <button className="back-button" onClick={onBack}>
            &#10094; Volver atras
          </button>
          <button className="confirm-button">
            &#10003; Confirmar vehículo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;
