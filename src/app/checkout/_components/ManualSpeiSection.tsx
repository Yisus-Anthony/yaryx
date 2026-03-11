"use client";

import { useState } from "react";
import styles from "./ManualSpeiSection.module.css";
import type { CheckoutCustomerData } from "./CheckoutCustomerForm";

type Props = {
  customer: CheckoutCustomerData;
  onResult: (result: {
    type: "success" | "error";
    message: string;
  }) => void;
};

type TransferResponse = {
  ok: true;
  orderId: string;
  paymentId: string;
  reference: string;
  total: number;
  bank: {
    bankName: string;
    accountHolder: string;
    clabe: string;
    accountNumber: string;
    cardReference: string;
    instructions: string[];
  };
};

function money(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(n);
}

export default function ManualSpeiSection({ customer, onResult }: Props) {
  const [busy, setBusy] = useState(false);
  const [transfer, setTransfer] = useState<TransferResponse | null>(null);

  async function handleCreateTransferOrder() {
    setBusy(true);

    try {
      const res = await fetch("/api/checkout/manual-transfer", {
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

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "No se pudo preparar la transferencia SPEI");
      }

      setTransfer(data);

      onResult({
        type: "success",
        message: `Orden creada para transferencia SPEI. Referencia: ${data.reference}`,
      });
    } catch (error: any) {
      onResult({
        type: "error",
        message: error?.message ?? "No se pudo preparar la transferencia SPEI",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2>Transferencia SPEI</h2>
        <p>Pago manual directo a tu cuenta bancaria.</p>
      </div>

      <button
        type="button"
        className={styles.button}
        onClick={handleCreateTransferOrder}
        disabled={busy || !customer.email.trim()}
      >
        {busy ? "Preparando referencia..." : "Generar instrucciones SPEI"}
      </button>

      {!customer.email.trim() ? (
        <div className={styles.notice}>
          Debes capturar tu correo para generar la referencia.
        </div>
      ) : null}

      {transfer ? (
        <div className={styles.instructions}>
          <div><strong>Referencia de pedido:</strong> {transfer.reference}</div>
          <div><strong>Total a transferir:</strong> {money(transfer.total)}</div>
          <div><strong>Banco:</strong> {transfer.bank.bankName}</div>
          <div><strong>Beneficiario:</strong> {transfer.bank.accountHolder}</div>
          <div><strong>CLABE:</strong> {transfer.bank.clabe}</div>
          <div><strong>Cuenta:</strong> {transfer.bank.accountNumber}</div>
          <div><strong>Referencia visual:</strong> {transfer.bank.cardReference}</div>

          <div className={styles.listBlock}>
            <strong>Instrucciones</strong>
            <ul>
              {transfer.bank.instructions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}
