"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { addItem } = useCart();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function add(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    setBusy(true);
    setMsg(null);

    try {
      await addItem(productId, 1);
      setMsg("Agregado ✅");
      setTimeout(() => setMsg(null), 1500);
    } catch (e: any) {
      setMsg(e?.message ?? "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: 10 }}>
      <button
        type="button"
        onClick={add}
        disabled={busy}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #111827",
          background: "#111827",
          color: "#fff",
          fontWeight: 700,
          cursor: busy ? "not-allowed" : "pointer",
        }}
      >
        {busy ? "Agregando..." : "Agregar al carrito"}
      </button>

      {msg ? (
        <div style={{ marginTop: 8, fontSize: 13, opacity: 0.9 }}>{msg}</div>
      ) : null}
    </div>
  );
}
