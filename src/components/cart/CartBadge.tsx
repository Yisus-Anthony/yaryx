"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import styles from "./CartBadge.module.css";

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
      <path
        d="M3 4h2l2.2 9.2A2 2 0 0 0 9.15 15H18a2 2 0 0 0 1.94-1.5L21 8H7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="19" r="1.8" fill="currentColor" />
      <circle cx="17" cy="19" r="1.8" fill="currentColor" />
    </svg>
  );
}

export default function CartBadge() {
  const { totals, loading } = useCart();

  return (
    <Link href="/cart" className={styles.cartLink} aria-label="Ir al carrito">
      <span className={styles.iconWrap}>
        <CartIcon />
        {!loading && totals.count > 0 ? (
          <span className={styles.badge}>
            {totals.count > 99 ? "99+" : totals.count}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
