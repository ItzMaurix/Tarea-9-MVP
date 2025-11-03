import React, { useState, useEffect, useRef, useMemo } from "react";
import { SPACES } from "../data/spaces";
import { Storage } from "../services/storageService";

function todayISO() {
  const t = new Date();
  return t.toISOString().split('T')[0];
}

function uid(prefix = "r") {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
}

export default function Reservations() {
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [saved, setSaved] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [showMyReservations, setShowMyReservations] = useState(false);
  const [message, setMessage] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const formRef = useRef(null);

  const currentUser = (typeof Storage !== "undefined" && Storage.getCurrentUser)
    ? Storage.getCurrentUser()
    : { id: "guest", name: "Residente" };

  const slots = useMemo(() => [
    "10:00-12:00", "12:00-14:00", "14:00-16:00", 
    "16:00-18:00", "18:00-20:00", "20:00-22:00",
  ], []);

  // Storage helpers
  const loadReservations = () => {
    try {
      if (typeof Storage !== "undefined") {
        if (Storage.getReservations) return Storage.getReservations();
        if (Storage.getAllReservations) return Storage.getAllReservations();
      }
      const raw = localStorage.getItem("reservations_v1");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  const persistReservations = (list) => {
    try {
      if (typeof Storage !== "undefined") {
        if (Storage.saveReservations) return Storage.saveReservations(list);
        if (Storage.saveReservationList) return Storage.saveReservationList(list);
      }
      localStorage.setItem("reservations_v1", JSON.stringify(list));
    } catch (e) {}
  };

  const persistSingleReservation = (res) => {
    try {
      if (typeof Storage !== "undefined" && Storage.saveReservation) {
        return Storage.saveReservation(res);
      }
    } catch (e) {}
    const cur = loadReservations();
    const updated = [...cur, res];
    persistReservations(updated);
  };

  const removeReservationById = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta reserva?')) return;

    try {
      if (typeof Storage !== "undefined" && Storage.deleteReservation) {
        Storage.deleteReservation(id);
      } else {
        const cur = loadReservations();
        const updated = cur.filter((r) => r.id !== id);
        persistReservations(updated);
      }
    } catch (e) {}
    
    setReservations((prev) => prev.filter((r) => r.id !== id));
    setMessage({ type: "success", text: "Reserva eliminada correctamente." });
  };

  useEffect(() => {
    const loaded = loadReservations() || [];
    setReservations(loaded);
  }, []);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 1400);
      return () => clearTimeout(t);
    }
  }, [saved]);

  const onSelectSpace = (s) => {
    setSelectedSpace(s);
    setSaved(false);
    setMessage(null);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  };

  const clearForm = () => {
    setDate("");
    setSlot("");
    setSaved(false);
    setMessage(null);
  };

  const book = () => {
    setMessage(null);
    if (!selectedSpace || !date || !slot) {
      setMessage({ type: "error", text: "Selecciona espacio, fecha y horario." });
      return;
    }

    if (date < todayISO()) {
      setMessage({ type: "error", text: "La fecha debe ser hoy o una fecha futura." });
      return;
    }

    const conflict = reservations.some(
      (r) => r.spaceId === selectedSpace.id && r.date === date && r.slot === slot
    );
    if (conflict) {
      setMessage({ type: "error", text: "Ese horario ya está reservado para este espacio." });
      return;
    }

    const reservation = {
      id: uid(),
      spaceId: selectedSpace.id,
      spaceTitle: selectedSpace.title,
      date,
      slot,
      user: currentUser,
      createdAt: new Date().toISOString(),
    };

    try {
      persistSingleReservation(reservation);
    } catch (e) {}

    const updated = [...reservations, reservation];
    setReservations(updated);
    persistReservations(updated);

    setSaved(true);
    setMessage({ type: "success", text: "Reserva registrada correctamente." });
    setSlot("");
  };

  const myReservations = reservations.filter((r) => 
    r.user?.id === currentUser?.id || r.user?.name === currentUser?.name
  );

  const occupiedSlots = useMemo(() => {
    if (!selectedSpace || !date) return new Set();
    return new Set(
      reservations
        .filter(r => r.spaceId === selectedSpace.id && r.date === date)
        .map(r => r.slot)
    );
  }, [selectedSpace, date, reservations]);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
      {/* Header - Simplified */}
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ 
          margin: "0 0 8px 0", 
          fontSize: "1.8rem", 
          fontWeight: "bold",
          textAlign: "center"
        }}>
          Reserva de espacios
        </h1>
        <p style={{ 
          margin: 0, 
          color: "#666", 
          fontSize: "1rem",
          textAlign: "center" 
        }}>
          Selecciona un espacio para reservar
        </p>
      </header>

      {message && (
        <div
          role="status"
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 6,
            background: message.type === 'error' ? '#fef2f2' : '#f0f9ff',
            color: message.type === 'error' ? '#dc2626' : '#0369a1',
            border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bae6fd'}`
          }}
        >
          {message.text}
        </div>
      )}

      {/* Simplified Spaces Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: 20,
        marginBottom: 40 
      }}>
        {SPACES.map((space) => (
          <div
            key={space.id}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: 24,
              background: "white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}
          >
            <h2 style={{ 
              margin: "0 0 16px 0", 
              fontSize: "1.4rem", 
              fontWeight: "bold",
              color: "#333"
            }}>
              {space.title}
            </h2>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ 
                fontSize: "0.95rem", 
                color: "#666",
                marginBottom: 4
              }}>
                Capacidad: máximo {space.capacity} personas
              </div>
              <div style={{ 
                fontSize: "0.95rem", 
                color: "#666"
              }}>
                Tiempo de reserva: {space.time}
              </div>
            </div>

            <hr style={{ 
              border: "none", 
              borderTop: "1px solid #e0e0e0", 
              margin: "20px 0" 
            }} />

            <button
              onClick={() => onSelectSpace(space)}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                transition: "background-color 0.2s"
              }}
              onMouseOver={(e) => e.target.style.background = "#2563eb"}
              onMouseOut={(e) => e.target.style.background = "#3b82f6"}
            >
              Reservar
            </button>
          </div>
        ))}
      </div>

      {/* Reservation Form - Only shown when space is selected */}
      {selectedSpace && (
        <div ref={formRef} style={{
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          padding: 24,
          background: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: 40
        }}>
          <h2 style={{ 
            margin: "0 0 20px 0", 
            fontSize: "1.4rem", 
            fontWeight: "bold" 
          }}>
            Reservar {selectedSpace.title}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Date Selection */}
            <div>
              <label style={{ 
                display: "block", 
                fontSize: "0.95rem", 
                fontWeight: "500",
                marginBottom: 8 
              }}>
                Fecha
              </label>
              <input
                type="date"
                value={date}
                min={todayISO()}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  fontSize: "0.95rem"
                }}
              />
            </div>

            {/* Time Slot Selection */}
            <div>
              <label style={{ 
                display: "block", 
                fontSize: "0.95rem", 
                fontWeight: "500",
                marginBottom: 8 
              }}>
                Horario
              </label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  fontSize: "0.95rem",
                  background: "white"
                }}
              >
                <option value="">Selecciona un horario</option>
                {slots.map((timeSlot) => {
                  const isOccupied = occupiedSlots.has(timeSlot);
                  return (
                    <option 
                      key={timeSlot} 
                      value={timeSlot}
                      disabled={isOccupied}
                      style={{
                        color: isOccupied ? '#999' : '#000'
                      }}
                    >
                      {timeSlot} {isOccupied ? '(Ocupado)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div style={{ 
            display: "flex", 
            gap: 12, 
            marginTop: 24,
            paddingTop: 20,
            borderTop: "1px solid #eee"
          }}>
            <button
              onClick={book}
              disabled={!date || !slot}
              style={{
                padding: "12px 24px",
                background: (!date || !slot) ? "#9ca3af" : "#10b981",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: (!date || !slot) ? "not-allowed" : "pointer",
                fontSize: "1rem",
                fontWeight: "500",
                flex: 1
              }}
            >
              Confirmar Reserva
            </button>
            
            <button
              onClick={clearForm}
              style={{
                padding: "12px 24px",
                border: "1px solid #ddd",
                background: "white",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "1rem",
                flex: 1
              }}
            >
              Cancelar
            </button>
          </div>

          {saved && (
            <div style={{
              marginTop: 16,
              padding: 12,
              background: "#f0f9ff",
              color: "#0369a1",
              borderRadius: 6,
              fontSize: "0.95rem",
              border: "1px solid #bae6fd",
              textAlign: "center"
            }}>
              ✅ Reserva guardada correctamente
            </div>
          )}
        </div>
      )}

      {/* My Reservations Section */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: 16 
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: "1.4rem", 
          fontWeight: "bold" 
        }}>
          Mis reservas
        </h2>
        
        <button
          onClick={() => setShowMyReservations(!showMyReservations)}
          style={{
            padding: "8px 16px",
            border: "1px solid #ddd",
            background: "white",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: "0.9rem"
          }}
        >
          {showMyReservations ? "Ocultar" : `Mostrar (${myReservations.length})`}
        </button>
      </div>

      {showMyReservations && (
        <div>
          {myReservations.length === 0 ? (
            <div style={{
              padding: 40,
              textAlign: "center",
              color: "#666",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              background: "white"
            }}>
              No tienes reservas registradas
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {myReservations
                .slice()
                .sort((a, b) => new Date(a.date) - new Date(b.date) || a.slot.localeCompare(b.slot))
                .map((reservation) => (
                  <div 
                    key={reservation.id}
                    style={{
                      border: "1px solid #e0e0e0",
                      padding: 16,
                      borderRadius: 8,
                      background: "white",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <div style={{ 
                        fontSize: "1.1rem", 
                        fontWeight: "600",
                        marginBottom: 4
                      }}>
                        {reservation.spaceTitle}
                      </div>
                      <div style={{ 
                        fontSize: "0.95rem", 
                        color: "#666"
                      }}>
                        {reservation.date} · {reservation.slot}
                      </div>
                    </div>

                    <button
                      onClick={() => removeReservationById(reservation.id)}
                      style={{
                        padding: "8px 16px",
                        border: "1px solid #dc2626",
                        background: "white",
                        color: "#dc2626",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}