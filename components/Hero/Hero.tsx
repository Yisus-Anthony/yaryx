import Image from "next/image";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <main className={styles.hero}>
      <div className={styles.bg} />

      <section className={`${styles.inner} container`}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            <span className={styles.titleLight}>Diseño de</span><br />
            <span className={styles.titleAccent}>Páginas</span><br />
            <span className={styles.titleAccent}>Web</span>
          </h1>

          <p className={styles.subtitle}>
            Tiendas en línea y posicionamiento<br />
            web
          </p>

          <a className="btn btn--outline" href="/es/contacto">
            Solicitar<br />Cotización
          </a>
        </div>

        <div className={styles.right}>
          <div className={styles.spotlight} />
          <Image
            src="/assets/hero-phone.png"
            alt="Mockup de proyecto"
            width={900}
            height={900}
            priority
            className={styles.image}
          />
        </div>
      </section>
    </main>
  );
}