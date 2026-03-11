"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import styles from "./CheckoutPageClient.module.css";
import CheckoutCustomerForm, {
  type CheckoutCustomerData,
} from "./_components/CheckoutCustomerForm";
import CardPaymentSection from "./_components/CardPaymentSection";
import CashPaymentSection from "./_components/CashPaymentSection";
import ManualSpeiSection from "./_components/ManualSpeiSection";

function money(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(n);
}

type UiMessage = {
  type: "success" | "warning" | "error";
  text: string;
} | null;

export default function CheckoutPageClient() {
  const { cart, totals, loading } = useCart();
  const [message, setMessage] = useState<UiMessage>(null);

  const [customer, setCustomer] = useState<CheckoutCustomerData>({
    name: "",
    email: "",
    phone: "",
  });

  const items = cart?.items ?? [];

  const bannerClass = useMemo(() => {
    if (!message) return "";
    if (message.type === "success") return styles.bannerOk;
    if (message.type === "warning") return styles.bannerWarn;
    return styles.bannerErr;
  }, [message]);

  function handleResult(result: {
    type: "success" | "error";
    message: string;
  }) {
    setMessage({
      type: result.type === "success" ? "success" : "error",
      text: result.message,
    });
  }

  if (loading) {
    return <div className={styles.page}>Cargando checkout…</div>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <h1>Checkout</h1>
        <Link href="/cart" className={styles.backLink}>
          ← Volver al carrito
        </Link>
      </div>

      {message ? (
        <div className={`${styles.banner} ${bannerClass}`}>{message.text}</div>
      ) : null}

      {!items.length ? (
        <div className={styles.empty}>
          Tu carrito está vacío. <Link href="/products">Ir a productos</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          <div className={styles.left}>
            <CheckoutCustomerForm value={customer} onChange={setCustomer} />

            <div className={styles.methods}>
              <CardPaymentSection
                amount={totals.subtotal}
                customer={customer}
                onResult={handleResult}
              />

              <CashPaymentSection customer={customer} onResult={handleResult} />

              <ManualSpeiSection customer={customer} onResult={handleResult} />
            </div>
          </div>

          <aside className={styles.right}>
            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Resumen del pedido</h2>

              <div className={styles.items}>
                {items.map((item: any) => (
                  <div key={item.id} className={styles.itemRow}>
                    <div>
                      <div className={styles.itemName}>{item.product.name}</div>
                      <div className={styles.itemMeta}>
                        {item.quantity} × {money(Number(item.product.price))}
                      </div>
                    </div>

                    <div className={styles.itemStock}>
                      Stock actual: {item.product.stock}
                    </div>

                    <div className={styles.itemTotal}>
                      {money(Number(item.product.price) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Totales</h2>

              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}>
                  <span>Artículos</span>
                  <strong>{totals.count}</strong>
                </div>

                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <strong>{money(totals.subtotal)}</strong>
                </div>

                <div className={styles.summaryRow}>
                  <span>Envío</span>
                  <strong>{money(0)}</strong>
                </div>

                <div className={styles.summaryRow}>
                  <span>Total</span>
                  <strong>{money(totals.subtotal)}</strong>
                </div>
              </div>

              <div className={styles.infoBox}>
                Se valida stock antes de crear la orden. El descuento definitivo
                de inventario debe ejecutarse cuando el pago quede confirmado.
              </div>
            </section>
          </aside>
        </div>
      )}
    </main>
  );
}
