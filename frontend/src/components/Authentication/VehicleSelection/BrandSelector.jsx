import React from 'react';
import './BrandSelector.css';

// Datos temporales de marcas
const brands = [
  { name: 'Ford', logo: '/src/assets/img/logos/ford.png' },
  { name: 'Toyota', logo: '/src/assets/img/logos/toyota.png' },
  { name: 'Chevrolet', logo: '/src/assets/img/logos/chevrolet.png' },
  { name: 'Mercedes', logo: '/src/assets/img/logos/mercedes.png' },
  { name: 'Volkswagen', logo: '/src/assets/img/logos/volkswagen.png' },
  { name: 'Fiat', logo: '/src/assets/img/logos/fiat.png' },
  { name: 'Ford', logo: '/src/assets/img/logos/ford.png' },
  { name: 'Toyota', logo: '/src/assets/img/logos/toyota.png' },
  { name: 'Chevrolet', logo: '/src/assets/img/logos/chevrolet.png' },
  { name: 'Mercedes', logo: '/src/assets/img/logos/mercedes.png' },
  { name: 'Volkswagen', logo: '/src/assets/img/logos/volkswagen.png' },
  { name: 'Fiat', logo: '/src/assets/img/logos/fiat.png' },
  { name: 'Ford', logo: '/src/assets/img/logos/ford.png' },
  { name: 'Toyota', logo: '/src/assets/img/logos/toyota.png' },
  { name: 'Chevrolet', logo: '/src/assets/img/logos/chevrolet.png' },
  { name: 'Mercedes', logo: '/src/assets/img/logos/mercedes.png' },
  { name: 'Volkswagen', logo: '/src/assets/img/logos/volkswagen.png' },
  { name: 'Fiat', logo: '/src/assets/img/logos/fiat.png' },
];

const BrandSelector = ({ onBrandSelect }) => {
  return (
    <div className="brand-selector">
      <h1>Selecciona tu marca de Auto</h1>
      <div className="search-container">
        <input type="text" placeholder="search..." />
      </div>
      <div className="brand-grid">
        {brands.map((brand, index) => (
          <div key={index} className="brand-card" onDoubleClick={() => onBrandSelect(brand.name)}>
            <div className="brand-logo-container">
              <img src={brand.logo} alt={`${brand.name} logo`} />
            </div>
            <p>{brand.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandSelector;
