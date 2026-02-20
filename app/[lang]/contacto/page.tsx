import type { Metadata } from "next";
import { site } from "@/content/site";
import styles from "./contacto.module.css";

type Lang = "es" | "en";

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const canonical = `${site.url}/${params.lang}/contacto`;
  return {
    title: "Contacto",
    description: "Cuéntame qué necesitas y te respondo con propuesta y tiempos.",
    alternates: {
      canonical,
      languages: {
        es: `${site.url}/es/contacto`,
        en: `${site.url}/en/contacto`,
      },
    },
  };
}

export default function ContactPage() {
  return (
    <main className="page container">
      <header className="page__header">
        <h1 className="page__title">Contacto</h1>
        <p className="page__lead">Cuéntame qué necesitas y te respondo con propuesta y tiempos.</p>
      </header>

      <section className="card">
        <form className={styles.form} action={site.formspreeEndpoint} method="POST">
          <div className={styles.row}>
            <label className={styles.label} htmlFor="name">Nombre</label>
            <input className={styles.input} id="name" name="name" type="text" required />
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input className={styles.input} id="email" name="email" type="email" required />
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="service">Servicio</label>
            <select className={styles.input} id="service" name="service" required defaultValue="">
              <option value="" disabled>Selecciona…</option>
              <option>Diseño web</option>
              <option>Posicionamiento SEO</option>
              <option>Diseño gráfico</option>
              <option>Gestión de redes sociales</option>
              <option>Diseño de logo</option>
              <option>Marketing</option>
              <option>Diseño de anuncios</option>
            </select>
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="msg">Mensaje</label>
            <textarea className={`${styles.input} ${styles.textarea}`} id="msg" name="message" rows={6} required />
          </div>

          <button className="btn btn--outline" type="submit">Enviar</button>
          <p className={styles.hint}>Tip: configura tu endpoint real en NEXT_PUBLIC_FORMSPREE_ENDPOINT.</p>
        </form>
      </section>
    </main>
  );
}