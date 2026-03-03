import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-label="Footer">
      <div className={styles.inner}>
        {/* Payments */}
        <div className={styles.payments} aria-label="Métodos de pago">
          <LogoMastercard />
          <LogoVisa />
          <LogoAmex />
          <LogoPayPal />
          <LogoSpei />
          <Image
            src="/mercado-pago.png"
            alt="Mercado Pago"
            width={120}
            height={40}
            className={styles.logo}
          />
        </div>

        {/* Social */}
        <nav className={styles.social} aria-label="Redes sociales">
          <Link
            className={styles.socialLink}
            href="https://instagram.com/TU_USUARIO"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <IconInstagram />
          </Link>

          <Link
            className={styles.socialLink}
            href="https://facebook.com/TU_PAGINA"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <IconFacebook />
          </Link>

          <Link
            className={styles.socialLink}
            href="https://x.com/TU_USUARIO"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
          >
            <IconX />
          </Link>
        </nav>

        {/* Bottom row */}
        <div className={styles.bottom}>
          <span className={styles.copy}>© {year} Tu Refaccionaria</span>
          <span className={styles.muted}>Mexico</span>
        </div>
      </div>
    </footer>
  );
}

/* -------------------- SVGs (inline, sin imágenes) -------------------- */

function SvgWrap({ title, children, className }) {
  return (
    <svg
      className={className}
      role="img"
      aria-label={title}
      viewBox="0 0 120 40"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function LogoMastercard() {
  return (
    <SvgWrap title="Mastercard" className={styles.logo}>
      <rect
        x="0"
        y="0"
        width="120"
        height="40"
        rx="8"
        fill="currentColor"
        opacity="0.06"
      />
      <circle cx="56" cy="20" r="11.5" fill="#EB001B" />
      <circle cx="64" cy="20" r="11.5" fill="#F79E1B" opacity="0.95" />
      <text
        x="60"
        y="34"
        textAnchor="middle"
        fontSize="8"
        fill="currentColor"
        opacity="0.85"
      >
        mastercard
      </text>
    </SvgWrap>
  );
}

function LogoVisa() {
  return (
    <SvgWrap title="Visa" className={styles.logo}>
      <rect
        x="0"
        y="0"
        width="120"
        height="40"
        rx="8"
        fill="currentColor"
        opacity="0.06"
      />
      <text
        x="60"
        y="27"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill="#1A1F71"
        letterSpacing="1"
      >
        VISA
      </text>
    </SvgWrap>
  );
}

function LogoAmex() {
  return (
    <SvgWrap title="American Express" className={styles.logo}>
      <rect x="0" y="0" width="120" height="40" rx="8" fill="#2E77BB" />
      <text
        x="60"
        y="18"
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        fill="#fff"
      >
        AMERICAN
      </text>
      <text
        x="60"
        y="31"
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        fill="#fff"
      >
        EXPRESS
      </text>
    </SvgWrap>
  );
}

function LogoPayPal() {
  return (
    <SvgWrap title="PayPal" className={styles.logo}>
      <rect
        x="0"
        y="0"
        width="120"
        height="40"
        rx="8"
        fill="currentColor"
        opacity="0.06"
      />
      <text
        x="44"
        y="27"
        textAnchor="end"
        fontSize="20"
        fontWeight="800"
        fill="#003087"
      >
        Pay
      </text>
      <text
        x="46"
        y="27"
        textAnchor="start"
        fontSize="20"
        fontWeight="800"
        fill="#009CDE"
      >
        Pal
      </text>
    </SvgWrap>
  );
}

function LogoSpei() {
  return (
    <SvgWrap title="SPEI" className={styles.logo}>
      <rect
        x="0"
        y="0"
        width="120"
        height="40"
        rx="8"
        fill="currentColor"
        opacity="0.06"
      />

      {/* SPEI (S P en azul, E en naranja, I en azul) */}
      <text
        x="52"
        y="27"
        textAnchor="middle"
        fontSize="26"
        fontWeight="900"
        fontFamily="Arial Black, Arial, sans-serif"
        letterSpacing="1"
      >
        <tspan fill="#2F2E7E">SP</tspan>
        <tspan fill="#F28C1B">E</tspan>
        <tspan fill="#2F2E7E">I</tspan>
      </text>

      {/* ® pequeño (como en tu imagen) */}
      <text
        x="92"
        y="14"
        fontSize="8"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
        fill="#F28C1B"
      >
        ®
      </text>
    </SvgWrap>
  );
}

function LogoOxxo() {
  return (
    <SvgWrap title="OXXO" className={styles.logo}>
      {/* Fondo rojo */}
      <rect x="0" y="0" width="120" height="40" rx="8" fill="#E30613" />

      {/* Borde amarillo superior */}
      <rect x="0" y="0" width="120" height="6" fill="#F5A300" />

      {/* Borde amarillo inferior */}
      <rect x="0" y="34" width="120" height="6" fill="#F5A300" />

      {/* Texto OXXO estilizado */}
      <text
        x="60"
        y="27"
        textAnchor="middle"
        fontSize="26"
        fontWeight="900"
        fontFamily="Arial Black, Impact, sans-serif"
        fill="#FFFFFF"
        letterSpacing="2"
      >
        OXXO
      </text>
    </SvgWrap>
  );
}

/* -------------------- Social Icons -------------------- */

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3.2A4.8 4.8 0 1 0 16.8 12 4.806 4.806 0 0 0 12 7.2zm0 7.8A3 3 0 1 1 15 12a3.003 3.003 0 0 1-3 3zm5.6-8.6a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2z"
      />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        fill="currentColor"
        d="M13 22v-8h3l1-4h-4V7c0-1.2.3-2 2-2h2V1.2C16.7 1.1 15.3 1 14 1c-3 0-5 1.8-5 5v3H6v4h3v8h4z"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.9 2H22l-6.6 7.5L23 22h-6.8l-5.3-7-6.1 7H2l7-8L1 2h6.9l4.8 6.3L18.9 2z"
      />
    </svg>
  );
}
