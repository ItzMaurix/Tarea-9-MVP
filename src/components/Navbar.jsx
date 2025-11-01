import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { Storage } from "../services/storageService";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    Storage.logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <img src={logo} alt="Santa Helena" className="sidebar-logo" />
      </div>

      <nav className="sidebar-nav">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">Inicio</Link>
            <Link to="/reservations" className="nav-link">Reservar</Link>
            <Link to="/visits" className="nav-link">Visitas</Link>
            <Link to="/payments" className="nav-link">Gastos</Link>
            <button onClick={logout} className="nav-link logout-button">Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Iniciar sesión</Link>
            <Link to="/register" className="nav-link">Registrarse</Link>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <small>© {new Date().getFullYear()} Santa Helena</small>
      </div>
    </aside>
  );
}
