import React, { useState } from "react";
import { Storage } from "../services/storageService";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo1.png";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitError, setSubmitError] = useState("");
  const nav = useNavigate();

  const passwordsMatch = password === confirmPassword;
  const isEmailValid = email.trim() !== "" && email.includes("@"); // comprobación sencilla
  const isFormValid =
    name.trim() !== "" &&
    isEmailValid &&
    password.length >= 6 &&
    passwordsMatch;

  const handleRegister = (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!isFormValid) {
      if (!passwordsMatch) {
        setSubmitError("Las contraseñas no coinciden.");
      } else if (password.length < 6) {
        setSubmitError("La contraseña debe tener al menos 6 caracteres.");
      } else if (!isEmailValid) {
        setSubmitError("Ingresa un correo electrónico válido.");
      } else {
        setSubmitError("Por favor completa todos los campos.");
      }
      return;
    }

    // Registro (misma lógica original)
    Storage.register({ name, email, password });
    alert("Usuario registrado. Ahora ingresa.");
    nav("/login");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Bienvenid@ a</h1>
        <img src={logo} alt="Santa Helena" className="login-logo" />
        <p className="login-subtitle">Crea tu cuenta para comenzar</p>

        <form onSubmit={handleRegister} className="login-form" noValidate>
          <label className="field-label">
            Nombre
            <input
              className="field-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="field-label">
            Correo electrónico
            <input
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>

          <label className="field-label">
            Contraseña
            <input
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={6}
            />
          </label>

          <label className="field-label">
            Confirmar contraseña
            <input
              className="field-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              required
              minLength={6}
            />
          </label>

          {/* Mensajes de error inline */}
          {!passwordsMatch && confirmPassword.length > 0 && (
            <div style={{ color: "red", marginTop: 8 }}>Las contraseñas no coinciden.</div>
          )}
          {password.length > 0 && password.length < 6 && (
            <div style={{ color: "red", marginTop: 8 }}>
              La contraseña debe tener al menos 6 caracteres.
            </div>
          )}
          {submitError && <div style={{ color: "red", marginTop: 8 }}>{submitError}</div>}

          <button
            className="primary-btn"
            type="submit"
            disabled={!isFormValid}
            aria-disabled={!isFormValid}
          >
            Registrarse
          </button>
        </form>

        <p className="login-footer">
          ¿Ya tienes cuenta? <Link to="/login">Ingresar</Link>
        </p>
      </div>
    </div>
  );
}