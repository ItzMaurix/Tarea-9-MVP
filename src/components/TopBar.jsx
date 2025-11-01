// src/components/TopBar.jsx
import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../App";
import defaultAvatar from "../assets/avatar.png"; // opcional: coloca avatar.png en src/assets/

/**
 * Mapea rutas a títulos visibles en la franja superior.
 * Ajusta las claves si tus rutas cambian.
 */
const titleMap = {
  "/dashboard": "Menú Principal",
  "/reservations": "Reservas",
  "/visits": "Registro de visitas",
  "/payments": "Gastos comunes",
  "/login": "Iniciar sesión",
  "/register": "Registro",
};

export default function TopBar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Busca título por ruta exacta, si no existe intenta con startsWith (para subroutes)
  const pathname = location.pathname;
  let title = titleMap[pathname] || Object.keys(titleMap).find(k => pathname.startsWith(k)) && titleMap[Object.keys(titleMap).find(k => pathname.startsWith(k))];
  if (!title) {
    // Fallback: capitalizar primera parte de la ruta
    const p = pathname.replace("/", "") || "Inicio";
    title = p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, " ");
  }

  // Nombre mostrado (fallback)
  const displayName = user?.name || user?.email || "Residente";

  // Avatar: si tienes user.avatar (url) úsala, sino usar asset o iniciales
  const avatarSrc = user?.avatarUrl || defaultAvatar;

  // Si no tienes avatar.png en assets, también renderizamos iniciales
  const initials = displayName.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase();

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h2 className="topbar-title">{title}</h2>
      </div>

      <div className="topbar-right">
        <div className="user-info" title={displayName}>
          {avatarSrc ? (
            <img src={avatarSrc} alt="avatar" className="user-avatar" />
          ) : (
            <div className="user-avatar user-initials">{initials}</div>
          )}
          <div className="user-meta">
            <div className="user-name">{displayName}</div>
            <div className="user-role">{user?.role || "Residente"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}