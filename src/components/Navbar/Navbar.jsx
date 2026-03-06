"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import ButtonLink from "../ButtonLink/ButtonLink";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
          <ButtonLink href="/contact" variant="ghost">
            Ir a Contacto
          </ButtonLink>
        </div>

        {/* Botón hamburguesa (solo mobile) */}
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

        {/* Menú tipo overflow */}
        <div
          id="mobile-menu"
          className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`}
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

            {/* ButtonLink “forzado” a verse como item overflow (solo aquí) */}
            <Link
              className={styles.mobileLink}
              href="/contact"
              onClick={() => setOpen(false)}
            >
              Ir a Contacto
            </Link>

            {/* Opcional: Yaryx */}
            {/* <div className={styles.divider} />
            <div className={styles.mobileItem}>
              <ButtonLink
                href="https://yaryx.com"
                external
                variant="primary"
                onClick={() => setOpen(false)}
              >
                Yaryx
              </ButtonLink>
            </div> */}
          </div>
        </div>

        {/* Backdrop (tocar afuera cierra) */}
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
