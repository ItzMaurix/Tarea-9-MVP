import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";
import { Storage } from "../services/storageService";

export default function Login(){
  const [email, setEmail] = useState("usuario@example.com");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = Storage.login(email, password);
    if(user){
      Storage.setCurrentUser(user);
      setUser(user);
      nav("/dashboard");
    } else {
      alert("Credenciales inválidas. (usa usuario@example.com / 123456 como ejemplo)");
    }
  };

  return (
    <div className="auth-page">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <label>Correo Electrónico
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" />
        </label>
        <label>Contraseña
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        </label>
        <button type="submit">Ingresar</button>
      </form>
      <p>¿No tienes cuenta? <Link to="/register">Registrarse</Link></p>
    </div>
  );
}
