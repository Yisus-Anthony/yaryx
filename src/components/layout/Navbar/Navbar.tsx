"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import ButtonLink from "../../ui/ButtonLink/ButtonLink";
import CartBadge from "@/components/cart/CartBadge";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/" onClick={() => setOpen(false)}>
          Tu Refaccionaria
        </Link>

        {/* NAV desktop */}
        <nav className={styles.nav} aria-label="Primary navigation">
          <Link className={styles.navLink} href="/about">
            Nosotros
          </Link>
        </nav>

        {/* Acciones desktop */}
        <div className={styles.actions}>
          <CartBadge />
          <ButtonLink href="/contact" variant="ghost">
            Ir a Contacto
          </ButtonLink>
        </div>

        {/* Mobile actions */}
        <div className={styles.mobileActions}>
          <CartBadge />

          <button
            type="button"
            className={styles.burger}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.burgerIcon} aria-hidden="true" />
          </button>
        </div>

        {/* Menú mobile */}
        <div
          id="mobile-menu"
          className={`${styles.mobileMenu} ${
            open ? styles.mobileMenuOpen : ""
          }`}
          role="menu"
        >
          <div className={styles.mobileMenuInner}>
            <Link
              className={styles.mobileLink}
              href="/about"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              Nosotros
            </Link>

            <div className={styles.divider} />

            <Link
              className={styles.mobileLink}
              href="/contact"
              onClick={() => setOpen(false)}
            >
              Ir a Contacto
            </Link>
          </div>
        </div>

        {open && (
          <button
            className={styles.backdrop}
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
          />
        )}
      </div>
    </header>
  );
}
