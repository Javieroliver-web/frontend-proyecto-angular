// src/services/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// inyecta token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.handleError = (err) => {
  if (!err.response) {
    return { message: "No hay respuesta del servidor" };
  }
  return err.response.data || { message: err.response.statusText };
};

export default api;
