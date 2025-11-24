import axios from "axios";

const API_BASE = "/api/vehiculos";

export const getBasica = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}/basica`);
  return res.data;
};

export const getConsumo = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}/consumo`);
  return res.data;
};

export const getHistorial = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}/historial`);
  return res.data;
};
