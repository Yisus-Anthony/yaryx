import styles from "./ServicePage.module.css";
import type { Service } from "@/content/services";

type Lang = "es" | "en";

export function ServicePage({ lang, service }: { lang: Lang; service: Service }) {
  const contactoHref = `/${lang}/contacto`;
  const secondaryHref = service.secondarySlug ? `/${lang}/servicios/${service.secondarySlug}` : null;

  return (
    <main className={`${styles.service} container`}>
      <header className={styles.hero}>
        <p className={styles.kicker}>Servicios</p>
        <h1 className={styles.title}>{service.title}</h1>
        <p className={styles.lead}>{service.lead}</p>

        <div className={styles.actions}>
          <a className="btn btn--outline" href={contactoHref}>Solicitar cotización</a>
          {secondaryHref && service.secondaryLabel ? (
            <a className={styles.link} href={secondaryHref}>{service.secondaryLabel}</a>
          ) : null}
        </div>
      </header>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2 className={styles.h2}>{service.includesTitle}</h2>
          <ul className={styles.list}>
            {service.includes.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </article>

        <article className={styles.card}>
          <h2 className={styles.h2}>{service.secondTitle}</h2>
          <ul className={styles.list}>
            {service.secondList.map((x) => <li key={x}>{x}</li>)}
          </ul>
        </article>
      </section>

      {service.process?.length ? (
        <section className={`${styles.card} ${styles.wide}`}>
          <h2 className={styles.h2}>Proceso</h2>
          <ol className={styles.steps}>
            {service.process.map((x) => <li key={x}><strong>{x}</strong></li>)}
          </ol>
        </section>
      ) : null}
    </main>
  );
}