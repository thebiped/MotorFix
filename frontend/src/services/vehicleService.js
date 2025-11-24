// vehicleService.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function getBrands() {
  const res = await fetch(`${API_URL}/api/brands`);
  if (!res.ok) throw new Error("Error fetching brands");
  return res.json();
}

export async function getModelsByBrand(brandId) {
  const res = await fetch(`${API_URL}/api/models?brandId=${brandId}`);
  if (!res.ok) throw new Error("Error fetching models");
  return res.json();
}

// NUEVO: devuelve info básica de un vehículo
export async function getBasica(vehiculoId) {
  const res = await fetch(`${API_URL}/api/vehicles/${vehiculoId}/basica`);
  if (!res.ok) throw new Error("Error fetching vehicle basic info");
  return res.json();
}

export async function getConsumo(vehiculoId) {
  const res = await fetch(`${API_URL}/api/vehicles/${vehiculoId}/consumo`);
  if (!res.ok) throw new Error("Error fetching vehicle consumption info");
  return res.json();
}

export async function getHistorial(vehiculoId) {
  const res = await fetch(`${API_URL}/api/vehicles/${vehiculoId}/historial`);
  if (!res.ok) throw new Error("Error fetching vehicle history");
  return res.json();
}
