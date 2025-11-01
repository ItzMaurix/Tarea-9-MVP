import React, { useState } from "react";
import { Storage } from "../services/storageService";
import { useNavigate } from "react-router-dom";

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
    <div className="auth-page">
      <h2>Registrarse</h2>
      <form onSubmit={handleRegister}>
        <label>Nombre
          <input value={name} onChange={e=>setName(e.target.value)} />
        </label>
        <label>Correo
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" />
        </label>
        <label>Contraseña
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        </label>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
