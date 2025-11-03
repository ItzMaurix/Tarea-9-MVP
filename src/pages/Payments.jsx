import React, { useState, useEffect, useMemo } from "react";

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
  const [payments, setPayments] = useState(initialPayments ?? defaultPayments);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [globalLoading, setGlobalLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const totalPending = useMemo(
    () => payments.reduce((acc, p) => (!p.paid ? acc + (p.amount || 0) : acc), 0),
    [payments]
  );

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

  const toggleDetail = (id) => {
    setExpandedIds((prev) => (prev.has(id) ? removeFromSet(prev, id) : addToSet(prev, id)));
  };

  const payAll = () => {
    const unpaid = payments.filter((p) => !p.paid);
    if (unpaid.length === 0) {
      setMessage("No hay pagos pendientes.");
      return;
    }
    if (!window.confirm(`¿Confirmas pagar todo por ${formatCLP(totalPending)}?`)) return;

    setGlobalLoading(true);
    setMessage(null);

    setTimeout(() => {
      setPayments((prev) => prev.map((p) => ({ ...p, paid: true })));
      setGlobalLoading(false);
      setMessage(`Se pagaron ${unpaid.length} gastos por ${formatCLP(totalPending)}.`);
    }, 1000);
  };

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
                </div>
              </div>

              {expanded && (
                <div style={{ marginTop: 10, color: "#333", fontSize: 14 }}>
                  <div>{p.details}</div>
                  {p.dueDate && (
                    <div style={{ marginTop: 6, fontSize: 13, color: "#666" }}>
                      Vencimiento: {p.dueDate}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}