import React, { useState, useCallback } from "react";
import { Storage } from "../services/storageService";

export default function Dashboard() {
  const news = Storage.getNews() || [];
  const user = Storage.getCurrentUser();

  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = useCallback((id) => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

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
            {news.length === 0 && (
              <p>No hay noticias disponibles en este momento.</p>
            )}

            {news.map(n => {
              const isExpanded = expandedId === n.id;
              return (
                <article
                  key={n.id}
                  className={`news-card ${isExpanded ? "expanded" : ""}`}
                  aria-expanded={isExpanded}
                >
                  <div className="news-content">
                    <h3>{n.title}</h3>

                    {/* Mostrar excerpt o contenido completo según el estado */}
                    {!isExpanded ? (
                      <p className="news-excerpt">{n.excerpt}</p>
                    ) : (
                      <div className="news-full">
                        {/* n.content debe existir en los datos de Storage.getNews() */}
                        <p>{n.content}</p>
                      </div>
                    )}

                    <button
                      className="news-button"
                      onClick={() => toggleExpand(n.id)}
                      aria-controls={`news-details-${n.id}`}
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? "Mostrar menos" : "Ver más"}
                    </button>
                  </div>

                  {/* Zona opcional para detalles accesibles */}
                  {isExpanded && (
                    <div
                      id={`news-details-${n.id}`}
                      className="news-details"
                      role="region"
                      aria-labelledby={`news-title-${n.id}`}
                      style={{ marginTop: 8 }}
                    >
                      {/* Ya mostramos el contenido arriba; este bloque puede usarse para metadatos */}
                      {n.publishedAt && (
                        <small>Publicado: {new Date(n.publishedAt).toLocaleString()}</small>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Columna derecha - Información de contacto */}
        <section className="dashboard-right">
          <div className="contact-card">
            <h3>Fono de contacto</h3>
            <p className="contact-info">999-999-999-9</p>

            <h3>¿Tienes algún problema?</h3>
            <p className="contact-info">contáctanos: contacto@example.com</p>
          </div>
        </section>
      </div>
    </div>
  );
}
