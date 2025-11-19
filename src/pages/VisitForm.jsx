import React, { useState, useEffect } from "react";
import { Storage } from "../services/storageService";
import "../stylesheets/visits.scss";
import { UserCheck, ClipboardList } from 'lucide-react';

export default function Visits() {
  const [currentView, setCurrentView] = useState("menu"); // "menu", "register", "myVisits"
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [rut, setRut] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [myVisits, setMyVisits] = useState([]);

  // Cargar visitas al montar el componente
  useEffect(() => {
    loadMyVisits();
  }, []);

  const loadMyVisits = () => {
    const allVisits = Storage.getVisits() || [];
    const currentUser = Storage.getCurrentUser();
    const userVisits = allVisits.filter(visit => 
      visit.recordedBy === currentUser?.name || visit.recordedBy === currentUser?.id
    );
    setMyVisits(userVisits);
  };

  const submit = (e) => {
    e.preventDefault();
    const visitData = { 
      name, 
      lastname, 
      rut, 
      date, 
      message,
      recordedBy: Storage.getCurrentUser()?.name,
      createdAt: new Date().toISOString(),
      id: Date.now()
    };
    
    Storage.saveVisit(visitData);
    alert("Visita registrada correctamente.");
    
    // Limpiar formulario y volver al menú
    setName(""); 
    setLastname(""); 
    setRut(""); 
    setDate("");
    setMessage("");
    loadMyVisits(); // Actualizar la lista
    setCurrentView("menu");
  };

  const deleteVisit = (visitId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta visita?")) {
      // Filtrar las visitas para eliminar la seleccionada
      const updatedVisits = myVisits.filter(visit => visit.id !== visitId);
      setMyVisits(updatedVisits);
      
      // Actualizar localStorage
      const allVisits = Storage.getVisits() || [];
      const filteredVisits = allVisits.filter(visit => visit.id !== visitId);
      localStorage.setItem('mvp_visits_v1', JSON.stringify(filteredVisits));
      
      alert("Visita eliminada correctamente.");
    }
  };

  // Vista del menú principal
    if (currentView === "menu") {
      return (
        <div className="visit-container">
          <div className="visits-header">
            <h1 className="vf-title">Gestión de Visitas</h1>
            <p className="vf-description">Administra las visitas a tu departamento</p>
          </div>

          <div className="visits-menu">
            <div 
              className="visit-menu-card"
              onClick={() => setCurrentView("register")}
            >
              <div className="visit-menu-icon">
                <UserCheck className="lucide-icon" />
              </div>
              <h3>Registrar Visita</h3>
              <p>Agenda una nueva visita para tu departamento</p>
            </div>

            <div 
              className="visit-menu-card"
              onClick={() => setCurrentView("myVisits")}
            >
              <div className="visit-menu-icon">
                <ClipboardList className="lucide-icon" />
              </div>
              <h3>Mis Visitas</h3>
              <p>Revisa el historial de visitas registradas</p>
              <span className="visit-count">{myVisits.length} visitas</span>
            </div>
          </div>
        </div>
      );
    }

  // Vista de registro de visita
  if (currentView === "register") {
    return (
      <div className="visit-container">
        <div className="visits-header">
          <button 
            className="visit-back-button"
            onClick={() => setCurrentView("menu")}
          >
            ← Volver al menú
          </button>
          <h1 className="vf-title">Registrar Nueva Visita</h1>
          <p className="vf-description">Complete los siguientes datos para registrar la visita. Todos los campos son obligatorios.</p>
        </div>

        <form className="vf-form" onSubmit={submit}>
          <div className="vf-left">
            <label className="vf-label">
              <span className="vf-label-text">Nombre<span className="vf-required">*</span></span>
              <input
                className="vf-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ingrese nombre aquí..."
                required
              />
            </label>

            <label className="vf-label">
              <span className="vf-label-text">Apellido<span className="vf-required">*</span></span>
              <input
                className="vf-input"
                value={lastname}
                onChange={e => setLastname(e.target.value)}
                placeholder="Ingrese apellido aquí..."
                required
              />
            </label>

            <label className="vf-label">
              <span className="vf-label-text">RUT<span className="vf-required">*</span></span>
              <input
                className="vf-input"
                value={rut}
                onChange={e => setRut(e.target.value)}
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
                onChange={e => setDate(e.target.value)}
                type="date"
                required
              />
              <small className="vf-hint" aria-hidden={date ? "true" : "false"}>
                {date ? "" : "Día-Mes-Año"}
              </small>
            </label>

            <label className="vf-label">
              <span className="vf-label-text">Mensaje/Instrucciones</span>
              <textarea
                className="vf-textarea"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Ej: Visita familiar, traer documentación, estacionamiento especial, etc."
                rows="4"
              />
              <small className="vf-textarea-hint">
                Opcional: información adicional para la administración
              </small>
            </label>

            <button className="vf-cta" type="submit">
              Registrar Visita
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Vista de "Mis Visitas"
  if (currentView === "myVisits") {
    return (
      <div className="visit-container">
        <div className="visits-header">
          <button 
            className="visit-back-button"
            onClick={() => setCurrentView("menu")}
          >
            ← Volver al menú
          </button>
          <h1 className="vf-title">Mis Visitas Registradas</h1>
          <p className="vf-description">
            {myVisits.length === 0 
              ? "No tienes visitas registradas" 
              : `Total: ${myVisits.length} visita${myVisits.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {myVisits.length === 0 ? (
          <div className="visit-empty-state">
            <div className="visit-empty-icon">👥</div>
            <h3>No hay visitas registradas</h3>
            <p>Cuando registres visitas, aparecerán listadas aquí.</p>
            <button 
              className="visit-primary-button"
              onClick={() => setCurrentView("register")}
            >
              Registrar primera visita
            </button>
          </div>
        ) : (
          <div className="visits-list">
            {myVisits
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((visit) => (
                <div key={visit.id} className="visit-card">
                  <div className="visit-info">
                    <h3 className="visit-name">
                      {visit.name} {visit.lastname}
                    </h3>
                    <div className="visit-details">
                      <span className="visit-rut">RUT: {visit.rut}</span>
                      <span className="visit-date">Fecha: {visit.date}</span>
                      {visit.message && (
                        <span className="visit-message">
                          Mensaje: {visit.message}
                        </span>
                      )}
                    </div>
                    <div className="visit-meta">
                      Registrado por: {visit.recordedBy} • {new Date(visit.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    className="visit-delete-button"
                    onClick={() => deleteVisit(visit.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }
}