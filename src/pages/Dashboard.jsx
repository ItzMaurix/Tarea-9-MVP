import React from "react";
import { Storage } from "../services/storageService";

export default function Dashboard(){
  const news = Storage.getNews();
  const user = Storage.getCurrentUser();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>¡Bienvenid@ {user?.name || "Residente"}!</h1>
      </div>

      <div className="dashboard-content">
        {/* Columna izquierda - Noticias */}
        <section className="dashboard-left">
          <div className="section-header">
            <h2>Noticias relevantes</h2>
          </div>
          
          <div className="news-grid">
            {news.map(n => (
              <article key={n.id} className="news-card">
                <div className="news-content">
                  <h3>{n.title}</h3>
                  <p>{n.excerpt}</p>
                  <button className="news-button">Ver más</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Columna derecha - Información de contacto */}
        <section className="dashboard-right">
          <div className="contact-card">
            <h3>Fono de contacto</h3>
            <p className="contact-info">999-999-999-9</p>
            
            <h3>¿Tienes algún problema?</h3>
            <p className="contact-info">contactanos: contacto@example.com</p>
          </div>

          {/* Sección de gastos comunes (opcional, puedes quitarla si no la necesitas) */}
          <div className="payments-card">
            <h3>Gastos comunes</h3>
            <ul className="payments-list">
              <li>
                <span>Servicio de agua</span>
                <strong>15000$</strong>
                <button className="detail-button">Ver detalle</button>
              </li>
              <li>
                <span>Gastos comunes pendientes</span>
                <strong>35000$</strong>
                <button className="pay-button">Pagar</button>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}