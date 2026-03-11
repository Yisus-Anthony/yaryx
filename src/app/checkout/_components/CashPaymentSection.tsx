"use client";

import { useState } from "react";
import styles from "./CashPaymentSection.module.css";
import type { CheckoutCustomerData } from "./CheckoutCustomerForm";

type Props = {
  customer: CheckoutCustomerData;
  onResult: (result: { type: "success" | "error"; message: string }) => void;
};

type CashCheckoutResponse = {
  ok: boolean;
  ticketUrl?: string | null;
  barcode?: {
    content?: string | null;
    width?: number | null;
    height?: number | null;
    type?: string | null;
  } | null;
  reference?: string | null;
  error?: string;
};

export default function CashPaymentSection({ customer, onResult }: Props) {
  const [busy, setBusy] = useState(false);
  const [ticketUrl, setTicketUrl] = useState<string | null>(null);
  const [barcode, setBarcode] = useState<{
    content?: string | null;
    width?: number | null;
    height?: number | null;
    type?: string | null;
  } | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  async function handleGenerateTicket() {
    setBusy(true);

    try {
      const res = await fetch("/api/checkout/cash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customer.email,
          customerName: customer.name,
          customerPhone: customer.phone,
        }),
      });

      const data: CashCheckoutResponse = await res.json().catch(() => ({
        ok: false,
        error: "Respuesta inválida del servidor",
      }));

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "No se pudo generar la ficha OXXO");
      }

      setTicketUrl(data.ticketUrl ?? null);
      setBarcode(data.barcode ?? null);
      setReference(data.reference ?? null);

      onResult({
        type: "success",
        message: `Ficha OXXO generada correctamente. Referencia: ${data.reference ?? "sin referencia"}`,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo generar la ficha OXXO";

      onResult({
        type: "error",
        message,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2>Pagar en efectivo</h2>
        <p>Genera una ficha para pagar en OXXO.</p>
      </div>

      <button
        type="button"
        className={styles.button}
        onClick={handleGenerateTicket}
        disabled={busy || !customer.email.trim()}
      >
        {busy ? "Generando ficha..." : "Generar ficha OXXO"}
      </button>

      {!customer.email.trim() ? (
        <div className={styles.notice}>
          Debes capturar tu correo para generar la ficha.
        </div>
      ) : null}

      {reference || barcode?.content || ticketUrl ? (
        <div className={styles.result}>
          {reference ? (
            <div>
              <strong>Referencia:</strong> {reference}
            </div>
          ) : null}

          {barcode?.content ? (
            <div>
              <strong>Código de barras:</strong> {barcode.content}
            </div>
          ) : null}

          {ticketUrl ? (
            <a
              href={ticketUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              Abrir ficha de pago
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
