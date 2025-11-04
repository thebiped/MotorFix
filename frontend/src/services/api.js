import axios from "axios";

// URL base de tu backend
// Asegurate que coincida con el puerto donde corre tu server (server.js)
const API_URL = "http://localhost:3001"; // <--- tu backend corre en 3001

// Crear la instancia de Axios
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para incluir el token en cada petición si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // token guardado tras registro/login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("⚠️ Sesión expirada o token inválido");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // En lugar de recargar toda la página, usamos navigate
      window.history.pushState({}, "", "/login");
    }
    return Promise.reject(error);
  }
);

// Funciones auxiliares
export const loginUser = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

// Exportar la instancia
export default api;
