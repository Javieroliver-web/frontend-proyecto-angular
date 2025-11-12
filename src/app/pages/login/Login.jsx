// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      nav("/recomendados");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img src="/assets/logo-sprintix.png" alt="Sprintix" className="logo" />
        <form onSubmit={onSubmit}>
          <label>Correo electrónico</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn-primary">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
}