import React, { useState } from "react";
import { Storage } from "../services/storageService";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo1.png";

export default function Register(){
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const nav = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    Storage.register({ name,email,password });
    alert("Usuario registrado. Ahora ingresa.");
    nav("/login");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Bienvenid@ a</h1>
        <img src={logo} alt="Santa Helena" className="login-logo" />
        <p className="login-subtitle">Crea tu cuenta para comenzar</p>

        <form onSubmit={handleRegister} className="login-form">
          <label className="field-label">Nombre
            <input className="field-input" value={name} onChange={e=>setName(e.target.value)} />
          </label>

          <label className="field-label">Correo electrónico
            <input className="field-input" value={email} onChange={e=>setEmail(e.target.value)} type="email" />
          </label>

          <label className="field-label">Contraseña
            <input className="field-input" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
          </label>

          <button className="primary-btn" type="submit">Registrarse</button>
        </form>

        <p className="login-footer">¿Ya tienes cuenta? <Link to="/login">Ingresar</Link></p>
      </div>
    </div>
  );
}