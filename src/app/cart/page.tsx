"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import styles from "./cart.module.css";

function cldUrl(publicId: string) {
  const cloud =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME;

  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_300,c_fill/${publicId}`;
}

function money(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(n);
}

export default function CartPage() {
  const { cart, loading, updateQty, removeItem, totals } = useCart();

  if (loading) return <div style={{ padding: 24 }}>Cargando carrito…</div>;

  const items = cart?.items ?? [];

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Carrito</h1>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p style={{ marginBottom: 12 }}>Tu carrito está vacío.</p>
          <Link href="/products">Ir a productos</Link>
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.list}>
            {items.map((it: any) => (
              <div key={it.id} className={styles.item}>
                <img
                  src={cldUrl(it.product.coverPublicId)}
                  alt={it.product.name}
                  className={styles.image}
                />

                <div className={styles.info}>
                  <div className={styles.name}>{it.product.name}</div>
                  <div className={styles.price}>
                    {money(Number(it.product.price))}
                  </div>
                  <button
                    onClick={() => removeItem(it.productId)}
                    className={styles.remove}
                  >
                    Quitar
                  </button>
                </div>

                <div className={styles.qty}>
                  <button
                    onClick={() =>
                      updateQty(it.productId, Math.max(1, it.quantity - 1))
                    }
                    className={styles.qtyBtn}
                  >
                    −
                  </button>
                  <div className={styles.qtyValue}>{it.quantity}</div>
                  <button
                    onClick={() => updateQty(it.productId, it.quantity + 1)}
                    className={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>

                <div className={styles.lineTotal}>
                  {money(Number(it.product.price) * it.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.row}>
              <span>Artículos</span>
              <b>{totals.count}</b>
            </div>

            <div className={styles.row}>
              <span>Subtotal</span>
              <b>{money(totals.subtotal)}</b>
            </div>

            <button
              className={styles.checkoutBtn}
              onClick={() => (window.location.href = "/checkout")}
            >
              Continuar a pago
            </button>

            <div className={styles.note}>
              Al continuar, validaremos stock antes de generar el pago.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
