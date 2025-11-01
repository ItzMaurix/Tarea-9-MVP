import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{
      textAlign: "center",
      marginTop: "100px",
      color: "#333",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" style={{
        textDecoration: "none",
        background: "#0b6173",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px"
      }}>
        Volver al inicio
      </Link>
    </div>
  );
}
