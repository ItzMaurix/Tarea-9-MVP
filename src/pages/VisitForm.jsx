import React, { useState } from "react";
import { Storage } from "../services/storageService";
import "../stylesheets/visitform.scss";

export default function VisitForm(){
  const [name,setName]=useState("");
  const [lastname,setLastname]=useState("");
  const [rut,setRut]=useState("");
  const [date,setDate]=useState("");

  const submit = (e) => {
    e.preventDefault();
    Storage.saveVisit({ name, lastname, rut, date, recordedBy: Storage.getCurrentUser()?.name});
    alert("Visita registrada. Gracias.");
    setName(""); setLastname(""); setRut(""); setDate("");
  };

  return (
    <div className="visit-container">
      <h2 className="vf-title">Datos del visitante</h2>
      <p className="vf-description">
        Complete los siguientes datos para registrar la visita. Todos los campos son obligatorios.
      </p>

      <form className="vf-form" onSubmit={submit}>
        <div className="vf-left">
          <label className="vf-label">
            <span className="vf-label-text">Nombre<span className="vf-required">*</span></span>
            <input
              className="vf-input"
              value={name}
              onChange={e=>setName(e.target.value)}
              placeholder="Ingrese nombre aquí..."
              required
              />
          </label>

          <label className="vf-label">
            <span className="vf-label-text">Apellido<span className="vf-required">*</span></span>
            <input
              className="vf-input"
              value={lastname}
              onChange={e=>setLastname(e.target.value)}
              placeholder="Ingrese apellido aquí..."
              required
              />
          </label>

          <label className="vf-label">
            <span className="vf-label-text">Rut<span className="vf-required">*</span></span>
            <input
              className="vf-input"
              value={rut}
              onChange={e=>setRut(e.target.value)}
              placeholder="99.999.999-9"
              required
              />
          </label>
        </div>

        <div className="vf-divider" aria-hidden="true" />

        <div className="vf-right">
          <label className="vf-label">
            <span className="vf-label-text">Fecha de visita<span className="vf-required">*</span></span>
            <input
              className="vf-input vf-date"
              value={date}
              onChange={e=>setDate(e.target.value)}
              type="date"
              required
              />
            <small className="vf-hint" aria-hidden={date ? "true" : "false"}>{date ? "" : "Día-Mes-Año"}</small>
          </label>

          <button className="vf-cta" type="submit">Ingresar datos</button>
        </div>
      </form>
    </div>
  );
}