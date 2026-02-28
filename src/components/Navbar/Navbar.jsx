import Link from "next/link";
import styles from "./Navbar.module.css";
import ButtonLink from "../ButtonLink/ButtonLink";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/">
          MiApp
        </Link>

        <nav className={styles.nav} aria-label="Primary navigation">
          <Link className={styles.navLink} href="/about">
            About
          </Link>
          <Link className={styles.navLink} href="/contact">
            Contact
          </Link>
        </nav>

        <div className={styles.actions}>
          <ButtonLink href="/contact" variant="ghost">
            Ir a Contacto
          </ButtonLink>
          <ButtonLink href="https://yaryx.com" external variant="primary">
            Yaryx
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
