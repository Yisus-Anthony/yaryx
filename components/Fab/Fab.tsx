import { site } from "@/content/site";
import styles from "./Fab.module.css";

export function Fab() {
  return (
    <a className={styles.fab} href={site.whatsappUrl} target="_blank" rel="noopener noreferrer">
      <span className={styles.icon} aria-hidden="true">☎</span>
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}