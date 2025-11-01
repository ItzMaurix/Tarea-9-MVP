import React from "react";
import { Storage } from "../services/storageService";

export default function Dashboard(){
  const news = Storage.getNews();
  const user = Storage.getCurrentUser();

  return (
    <div className="dashboard">
      <h1>¡Bienvenid@ {user?.name || "Residente"}!</h1>
      <section className="news-list">
        <h2>Noticias relevantes</h2>
        {news.map(n => (
          <article key={n.id} className="news-card">
            <h3>{n.title}</h3>
            <p>{n.excerpt}</p>
            <button>Ver más</button>
          </article>
        ))}
      </section>
      <section className="payments-summary">
        <h2>Gastos comunes</h2>
        <ul>
          <li>Servicio de agua <strong>15000$</strong> <button>Ver detalle</button></li>
          <li>Pago de gastos comunes pendientes <strong>Pagar 35000$</strong></li>
        </ul>
      </section>
    </div>
  );
}
