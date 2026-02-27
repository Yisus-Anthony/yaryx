import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>© {new Date().getFullYear()} MiApp</span>
        <span className={styles.muted}>Responsive · CSS Modules · Next.js</span>
      </div>
    </footer>
  );
}