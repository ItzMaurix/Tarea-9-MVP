import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import TopBar from "./components/TopBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Reservations from "./pages/Reservations";
import VisitForm from "./pages/VisitForm";
import Payments from "./pages/Payments";
import NotFound from "./pages/NotFound";
import { Storage } from "./services/storageService";

export const AuthContext = React.createContext();

export default function App() {
  const [user, setUser] = useState(Storage.getCurrentUser());

  useEffect(() => {
    Storage.init(); // in case we want default data
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Navbar />
      <TopBar />
      <main className="app-container">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/reservations" element={user ? <Reservations /> : <Navigate to="/login" />} />
            <Route path="/visits" element={user ? <VisitForm /> : <Navigate to="/login" />} />
            <Route path="/payments" element={user ? <Payments /> : <Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </main>
    </AuthContext.Provider>
  );
}