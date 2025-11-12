// src/services/authService.js
import api from "./api";

export const login = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { user };
  } catch (err) {
    throw api.handleError(err);
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
