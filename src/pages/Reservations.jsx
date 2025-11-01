import React, { useState } from "react";
import { SPACES } from "../data/spaces";
import { Storage } from "../services/storageService";

export default function Reservations(){
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [saved, setSaved] = useState(false);

  const slots = ["10:00-12:00","12:00-14:00","14:00-16:00","16:00-18:00","18:00-20:00","20:00-22:00"];

  const book = () => {
    if(!selectedSpace || !date || !slot) { alert("Selecciona espacio, fecha y horario."); return; }
    Storage.saveReservation({
      spaceId: selectedSpace.id,
      spaceTitle: selectedSpace.title,
      date, slot, user: Storage.getCurrentUser()
    });
    setSaved(true);
    alert("Reserva registrada correctamente.");
  };

  return (
    <div className="reservations">
      <h2>Reserva de espacios</h2>
      <div className="spaces-list">
        {SPACES.map(s => (
          <div key={s.id} className={`space-card ${selectedSpace?.id===s.id?'selected':''}`} onClick={()=>{setSelectedSpace(s); setSaved(false);}}>
            <h3>{s.title}</h3>
            <p>Capacidad: máximo {s.capacity} personas</p>
            <p>Tiempo de reserva: {s.time}</p>
            <button>Reservar</button>
          </div>
        ))}
      </div>

      {selectedSpace && (
        <div className="reservation-form">
          <h3>Reservar: {selectedSpace.title}</h3>
          <label>Fecha
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
          </label>
          <label>Horario
            <select value={slot} onChange={e=>setSlot(e.target.value)}>
              <option value="">--Seleccione--</option>
              {slots.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <button onClick={book}>Confirmar Reserva</button>
          {saved && <p>Reserva guardada. Revisa "Reservas" en localStorage.</p>}
        </div>
      )}
    </div>
  );
}
