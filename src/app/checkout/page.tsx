"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";

function money(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(n);
}

export default function CheckoutPage() {
  const { cart, totals, loading, refresh } = useCart();
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const status = searchParams.get("status");
  const reference = searchParams.get("reference");

  const items = cart?.items ?? [];

  const statusMessage = useMemo(() => {
    if (!status) return null;

    if (status === "success") {
      return {
        type: "ok" as const,
        text: `Pago iniciado/retornado correctamente. Referencia: ${reference ?? "-"}. La confirmación final depende del webhook.`,
      };
    }

    if (status === "pending") {
      return {
        type: "warn" as const,
        text: `Pago pendiente. Referencia: ${reference ?? "-"}`,
      };
    }

    if (status === "failure") {
      return {
        type: "err" as const,
        text: `El pago no se completó. Referencia: ${reference ?? "-"}`,
      };
    }

    return null;
  }, [status, reference]);

  async function handlePay() {
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: "MERCADOPAGO",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "No se pudo iniciar el checkout");
      }

      if (!data?.redirectUrl) {
        throw new Error("Mercado Pago no devolvió una URL de pago");
      }

      await refresh();
      window.location.href = data.redirectUrl;
    } catch (e: any) {
      setError(e?.message ?? "Error iniciando pago");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 24 }}>Cargando checkout…</div>;
  }

  return (
    <main style={{ maxWidth: 1000, margin: "40px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h1>Checkout</h1>
        <Link href="/cart">← Volver al carrito</Link>
      </div>

      {statusMessage ? (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
            background:
              statusMessage.type === "ok"
                ? "#ecfdf5"
                : statusMessage.type === "warn"
                ? "#fffbeb"
                : "#fef2f2",
          }}
        >
          {statusMessage.text}
        </div>
      ) : null}

      {!items.length ? (
        <div style={{ marginTop: 24 }}>
          Tu carrito está vacío. <Link href="/products">Ir a productos</Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 24,
            marginTop: 24,
          }}
        >
          <section
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: 16,
            }}
          >
            <h2 style={{ marginBottom: 16 }}>Resumen</h2>

            <div style={{ display: "grid", gap: 12 }}>
              {items.map((item: any) => (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    gap: 12,
                    alignItems: "center",
                    borderBottom: "1px solid #f3f4f6",
                    paddingBottom: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.product.name}</div>
                    <div style={{ fontSize: 13, opacity: 0.75 }}>
                      {item.quantity} × {money(Number(item.product.price))}
                    </div>
                  </div>

                  <div style={{ fontSize: 13, opacity: 0.75 }}>
                    Stock actual: {item.product.stock}
                  </div>

                  <div style={{ fontWeight: 700 }}>
                    {money(Number(item.product.price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: 16,
              height: "fit-content",
            }}
          >
            <h2 style={{ marginBottom: 16 }}>Pago</h2>

            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Artículos</span>
                <strong>{totals.count}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal</span>
                <strong>{money(totals.subtotal)}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Envío</span>
                <strong>{money(0)}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Total</span>
                <strong>{money(totals.subtotal)}</strong>
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 10,
                background: "#f9fafb",
                fontSize: 14,
              }}
            >
              Se validará stock antes de crear la orden y el descuento de stock
              se hace al confirmar el pago.
            </div>

            {error ? (
              <div
                style={{
                  marginTop: 12,
                  color: "#b91c1c",
                  fontSize: 14,
                }}
              >
                {error}
              </div>
            ) : null}

            <button
              type="button"
              onClick={handlePay}
              disabled={busy}
              style={{
                marginTop: 16,
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #111827",
                background: "#111827",
                color: "#fff",
                fontWeight: 700,
                cursor: busy ? "not-allowed" : "pointer",
              }}
            >
              {busy ? "Redirigiendo..." : "Pagar con Mercado Pago"}
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}