import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";
import { Storage } from "../services/storageService";
import logo from "../assets/logo1.png"; // Importación directa

export default function Login() {
  const [email, setEmail] = useState("usuario@example.com");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = Storage.login(email, password);
    if (user) {
      Storage.setCurrentUser(user);
      setUser(user);
      navigate("/dashboard");
    } else {
      alert("Credenciales inválidas.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Bienvenid@ a</h1>
        <img src={logo} alt="Santa Helena" className="login-logo" />
        <p className="login-subtitle">Inicia sesión para continuar</p>

        <form onSubmit={handleLogin} className="login-form">
          <label className="field-label">Correo electrónico
            <input className="field-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </label>

          <label className="field-label">Contraseña
            <input className="field-input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </label>

          <button className="primary-btn" type="submit">Ingresar</button>
        </form>

        <p className="login-footer">¿No tienes cuenta? <Link to="/register">Registrarse</Link></p>
      </div>
    </div>
  );
}
