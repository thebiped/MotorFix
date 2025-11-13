import React, { useState, useEffect } from 'react';
import './VehicleSelection.css';
import { Search, ChevronLeft, ChevronRight, Check, ArrowLeft } from 'lucide-react';

/* --- DATOS DE EJEMPLO --- */
// (Asegúrate de que estas rutas a las imágenes sean correctas en tu proyecto)

// Para la Pantalla 1: Selección de Marcas
const brands = [
  { name: 'Ford', logo: '/src/assets/img/logos/ford.png', image: '/src/assets/img/ford-mustang.png' },
  { name: 'Mercedes', logo: '/src/assets/img/logos/mercedes.png', image: '/src/assets/img/mercedes-gt.png' },
  { name: 'Toyota', logo: '/src/assets/img/logos/toyota.png', image: '/src/assets/img/toyota-supra.png' },
  { name: 'Chevrolet', logo: '/src/assets/img/logos/chevrolet.png', image: '/src/assets/img/chevrolet-camaro.png' },
  { name: 'Volkswagen', logo: '/src/assets/img/logos/volkswagen.png', image: '/src/assets/img/vw-golf.png' },
  { name: 'Fiat', logo: '/src/assets/img/logos/fiat.png', image: '/src/assets/img/fiat-500.png' },
];

// Para la Pantalla 2: Selección de Modelos
const models = {
  Toyota: [
    { name: 'Corolla 2021', image: '/src/assets/img/toyota-corolla-tuned.png' },
    { name: 'Supra GR 2022', image: '/src/assets/img/toyota-supra.png' },
    { name: 'Hilux 2022', image: '/src/assets/img/honda-civic.png' }, // Placeholder
  ],
  Ford: [
    { name: 'Mustang GT', image: '/src/assets/img/ford-mustang.png' },
    { name: 'Focus RS', image: '/src/assets/img/ford-focus.png' },
  ],
  Mercedes: [
    { name: 'AMG GT', image: '/src/assets/img/mercedes-gt.png' },
  ],
  Chevrolet: [
    { name: 'Camaro SS', image: '/src/assets/img/chevrolet-camaro.png' },
  ],
  Volkswagen: [
    { name: 'Golf GTI', image: '/src/assets/img/vw-golf.png' },
  ],
  Fiat: [
    { name: '500 Abarth', image: '/src/assets/img/fiat-500.png' },
  ]
  // ...rellenar con más datos si es necesario
};


/* --- Pantalla 1: Selector de Marcas --- */
const BrandSelector = ({ onBrandSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % brands.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + brands.length) % brands.length);
  };

  // Centrar el elemento activo. (Opcional, pero mejora la UX)
  useEffect(() => {
    const slider = document.querySelector('.brand-slider');
    const activeCard = document.querySelector('.brand-card.active');
    if (slider && activeCard) {
      const sliderRect = slider.getBoundingClientRect();
      const cardRect = activeCard.getBoundingClientRect();
      const scrollLeft = (cardRect.left - sliderRect.left) - (sliderRect.width / 2) + (cardRect.width / 2) + slider.scrollLeft;
      slider.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <div className="brand-selector">
      <header className="brand-header">
        <h1>Selecciona tu marca de Auto</h1>
        <div className="search-container">
          <Search size={18} color="#aaa" />
          <input type="text" placeholder="search..." />
        </div>
      </header>
      
      <div className="brand-slider-container">
        <button className="slider-nav-arrow prev" onClick={handlePrev}>
          <ChevronLeft size={48} />
        </button>
        <div className="brand-slider">
          {brands.map((brand, index) => (
            <div
              key={index}
              className={`brand-card ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              onDoubleClick={() => onBrandSelect(brand.name)}
            >
              <div className="brand-card-header">
                <img src={brand.logo} alt={`${brand.name} logo`} className="brand-logo" />
                <span className="brand-name">{brand.name.toUpperCase()}</span>
              </div>
              <img src={brand.image} alt={brand.name} className="brand-car-image" />
            </div>
          ))}
        </div>
        <button className="slider-nav-arrow next" onClick={handleNext}>
          <ChevronRight size={48} />
        </button>
      </div>
    </div>
  );
};

/* --- Pantalla 2: Selector de Modelos --- */
const ModelSelector = ({ brand, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const brandModels = models[brand] || [];

  // La función de animación que pediste
  const changeSlide = (direction) => {
    if (isAnimating) return; // Evitar clicks múltiples durante la animación

    setIsAnimating(true); // 1. Inicia la animación (añade clase 'exiting')
    
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % brandModels.length
      : (currentIndex - 1 + brandModels.length) % brandModels.length;

    // 2. Espera a que termine la animación de salida (300ms)
    setTimeout(() => {
      setCurrentIndex(newIndex); // 3. Cambia el auto y el texto
      setIsAnimating(false); // 4. Termina la animación (quita clase 'exiting')
    }, 300); // Este tiempo debe coincidir con la transition en el CSS
  };

  const nextSlide = () => changeSlide('next');
  const prevSlide = () => changeSlide('prev');

  if (brandModels.length === 0) {
    return (
      <div className="model-selector">
        <h2>No se encontraron modelos para {brand}</h2>
        <button onClick={onBack} className="back-button modern-button">
          <ArrowLeft size={16} /> Volver
        </button>
      </div>
    );
  }

  const currentModel = brandModels[currentIndex];
  const animationClass = isAnimating ? 'exiting' : '';

  return (
    <div className="model-selector">
      <header className="model-header">
        <button className="header-title-button">
          Selecciona tu Modelo de Auto
        </button>
      </header>

      <div className="slider-container">
        <button className="slider-arrow left" onClick={prevSlide}>
          <ChevronLeft size={60} />
        </button>
        
        <div className="slide-content">
          <div className="model-info">
            <h1 className={animationClass}>{brand}</h1>
            <p className={animationClass}>{currentModel.name}</p>
          </div>
          <img 
            src={currentModel.image} 
            alt={currentModel.name} 
            className={`model-image ${animationClass}`}
          />
          <div className="turntable-ring"></div>
        </div>
        
        <button className="slider-arrow right" onClick={nextSlide}>
          <ChevronRight size={60} />
        </button>
      </div>

      <footer className="form-and-actions">
        <div className="form-inputs">
          <div className="input-group">
            <label>Color</label>
            <select>
              <option>Elige un color</option>
              <option>Blanco</option>
              <option>Negro</option>
              <option>Rojo</option>
            </select>
          </div>
          <div className="input-group">
            <label>Patente</label>
            <input type="text" placeholder="Elije una patente" />
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="modern-button back-button" onClick={onBack}>
            <ArrowLeft size={16} /> Volver atras
          </button>
          <button className="modern-button confirm-button">
            <Check size={16} /> Confirmar vehículo
          </button>
        </div>
      </footer>
    </div>
  );
};


/* --- Componente Principal (Contenedor) --- */
const VehicleSelection = () => {
  const [selectedBrand, setSelectedBrand] = useState(null);

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
  };

  const handleBack = () => {
    setSelectedBrand(null);
  };

  return (
    <div className="vehicle-selection-container">
      <div className={`screen-container ${selectedBrand ? 'screen-active' : ''}`}>
        
        <div className="screen brand-screen">
          <BrandSelector onBrandSelect={handleBrandSelect} />
        </div>
        
        <div className="screen model-screen">
          {selectedBrand && (
            <ModelSelector brand={selectedBrand} onBack={handleBack} />
          )}
        </div>

      </div>
    </div>
  );
};

export default VehicleSelection;