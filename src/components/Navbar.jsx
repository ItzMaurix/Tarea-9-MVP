import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { Storage } from "../services/storageService";

export default function Navbar(){
  const { user, setUser } = useContext(AuthContext);
  const nav = useNavigate();

  const logout = () => {
    Storage.logout();
    setUser(null);
    nav("/login");
  };

  return (
    <header className="site-header">
      <div className="brand">Santa Helena</div>
      <nav>
        {user ? (
          <>
            <Link to="/dashboard">Menu Principal</Link>
            <Link to="/reservations">Reservar</Link>
            <Link to="/visits">Visitas</Link>
            <Link to="/payments">Gastos</Link>
            <button onClick={logout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
            <Link to="/about">Quienes Somos</Link>
          </>
        )}
      </nav>
    </header>
  );
}
