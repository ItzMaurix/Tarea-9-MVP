import React, { useState, useEffect, useMemo } from "react";
//import { Storage } from "../services/storageService"; // opcional: si no existe, el componente funciona igual

const defaultPayments = [
  {
    id: "p1",
    name: "Servicio de agua",
    amount: 15000,
    details: "Periodo: Sep 2025. Lectura: 12345 m3. Incluye cargo fijo.",
    paid: false,
  },
  {
    id: "p2",
    name: "Servicio de gas",
    amount: 20000,
    details: "Periodo: Sep 2025. Lectura: 54321 m3. Pago mínimo incluido.",
    paid: false,
  },
  {
    id: "p3",
    name: "Servicio de electricidad",
    amount: 9000,
    details: "Periodo: Sep 2025. Consumo: 120 kWh.",
    paid: false,
  },
];

function formatCLP(amount) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Payments({ initialPayments = null }) {
  // Cargar desde props -> Storage -> default
  const [payments, setPayments] = useState(() => {
    try {
      const stored = Storage?.getPayments ? Storage.getPayments() : null;
      return initialPayments ?? stored ?? defaultPayments;
    } catch (e) {
      return initialPayments ?? defaultPayments;
    }
  });

  // IDs expandidos (set) y estados de carga para pagos
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [globalLoading, setGlobalLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Total pendiente (solo impagos)
  const totalPending = useMemo(
    () => payments.reduce((acc, p) => (!p.paid ? acc + (p.amount || 0) : acc), 0),
    [payments]
  );

  // Helpers para Set en estado
  const addToSet = (set, val) => {
    const copy = new Set(set);
    copy.add(val);
    return copy;
  };
  const removeFromSet = (set, val) => {
    const copy = new Set(set);
    copy.delete(val);
    return copy;
  };

  // Persistir (si Storage.savePayments existe)
  const persistPayments = (updated) => {
    try {
      if (Storage?.savePayments) {
        Storage.savePayments(updated);
      }
    } catch (e) {
      // no hacemos nada si falla persistencia
    }
  };

  // Toggle detalle
  const toggleDetail = (id) => {
    setExpandedIds((prev) => (prev.has(id) ? removeFromSet(prev, id) : addToSet(prev, id)));
  };

  // Simular pago individual
  const payOne = (id) => {
    const item = payments.find((p) => p.id === id);
    if (!item || item.paid) return;
    if (!window.confirm(`¿Confirmas pagar ${item.name} por ${formatCLP(item.amount)}?`)) return;

    // marcar loading
    setLoadingIds((prev) => addToSet(prev, id));
    setMessage(null);

    // Simulación de pago asincrónico
    setTimeout(() => {
      setPayments((prev) => {
        const updated = prev.map((p) => (p.id === id ? { ...p, paid: true } : p));
        persistPayments(updated);
        return updated;
      });
      setLoadingIds((prev) => removeFromSet(prev, id));
      setMessage(`Pago de "${item.name}" realizado correctamente.`);
    }, 700);
  };

  // Pagar todo
  const payAll = () => {
    const unpaid = payments.filter((p) => !p.paid);
    if (unpaid.length === 0) {
      setMessage("No hay pagos pendientes.");
      return;
    }
    if (!window.confirm(`¿Confirmas pagar todo por ${formatCLP(totalPending)}?`)) return;

    setGlobalLoading(true);
    setMessage(null);

    // Simular proceso: marcar todos como pagados
    setTimeout(() => {
      setPayments((prev) => {
        const updated = prev.map((p) => ({ ...p, paid: true }));
        persistPayments(updated);
        return updated;
      });
      setGlobalLoading(false);
      setMessage(`Se pagaron ${unpaid.length} gastos por ${formatCLP(totalPending)}.`);
    }, 1000);
  };

  // Pagar individual desde UI (botón)
  const handlePayClick = (id) => payOne(id);

  return (
    <div className="payments-container" style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Gastos comunes</h2>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={payAll}
            disabled={totalPending === 0 || globalLoading}
            aria-disabled={totalPending === 0 || globalLoading}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              cursor: totalPending === 0 || globalLoading ? "not-allowed" : "pointer",
            }}
          >
            {globalLoading ? "Pagando..." : `Pagar todo (${formatCLP(totalPending)})`}
          </button>
        </div>
      </header>

      {message && (
        <div
          role="status"
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 6,
            background: "#eef6ea",
            color: "#0b5f2a",
          }}
        >
          {message}
        </div>
      )}

      <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
        {payments.map((p) => {
          const expanded = expandedIds.has(p.id);
          const loading = loadingIds.has(p.id);
          return (
            <li
              key={p.id}
              style={{
                border: "1px solid #ddd",
                padding: 12,
                borderRadius: 8,
                marginBottom: 12,
                background: p.paid ? "#f7f7f7" : "white",
                opacity: p.paid ? 0.7 : 1,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                  <strong style={{ display: "block" }}>{p.name}</strong>
                  <div style={{ fontSize: 14, color: "#555" }}>{formatCLP(p.amount)}</div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    onClick={() => toggleDetail(p.id)}
                    aria-expanded={expanded}
                    style={{ padding: "6px 10px", borderRadius: 6 }}
                  >
                    {expanded ? "Ocultar detalle" : "Ver detalle"}
                  </button>

                  <button
                    onClick={() => handlePayClick(p.id)}
                    disabled={p.paid || loading}
                    aria-disabled={p.paid || loading}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      cursor: p.paid || loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {p.paid ? "Pagado" : loading ? "Procesando..." : "Pagar"}
                  </button>
                </div>
              </div>

              {expanded && (
                <div style={{ marginTop: 10, color: "#333", fontSize: 14 }}>
                  <div>{p.details}</div>
                  {p.dueDate && <div style={{ marginTop: 6, fontSize: 13, color: "#666" }}>Vencimiento: {p.dueDate}</div>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
