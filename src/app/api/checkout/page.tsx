"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/cart/useCart";

export default function CheckoutPage() {
  const { totals } = useCart();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        Checkout
      </h1>

      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Image
          src="/mercado-pago.png"
          alt="Mercado Pago"
          width={160}
          height={48}
        />
        <div style={{ opacity: 0.85 }}>
          Total:{" "}
          <b>
            {new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
            }).format(totals.subtotal)}
          </b>
        </div>
      </div>

      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setErr(null);
          try {
            const r = await fetch("/api/checkout/mercadopago", {
              method: "POST",
            });
            const d = await r.json();
            if (!r.ok) throw new Error(d?.error ?? "Error creando pago");
            window.location.href = d.init_point ?? d.sandbox_init_point;
          } catch (e: any) {
            setErr(e?.message ?? "Error");
          } finally {
            setBusy(false);
          }
        }}
        style={{
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid #111827",
          background: "#111827",
          color: "white",
          cursor: busy ? "not-allowed" : "pointer",
          fontWeight: 700,
        }}
      >
        {busy ? "Generando pago…" : "Pagar con Mercado Pago"}
      </button>

      {err ? (
        <div style={{ marginTop: 12, color: "#ef4444" }}>{err}</div>
      ) : null}
    </div>
  );
}
