import React, { useState } from "react";
import { Storage } from "../services/storageService";

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
    <div className="visit-form">
      <h2>Registro de visitas</h2>
      <form onSubmit={submit}>
        <label>Nombre
          <input value={name} onChange={e=>setName(e.target.value)} />
        </label>
        <label>Apellido
          <input value={lastname} onChange={e=>setLastname(e.target.value)} />
        </label>
        <label>Rut
          <input value={rut} onChange={e=>setRut(e.target.value)} placeholder="99.999.999-9" />
        </label>
        <label>Fecha de visita
          <input value={date} onChange={e=>setDate(e.target.value)} type="date" />
        </label>
        <button type="submit">Ingresar datos</button>
      </form>
    </div>
  );
}
