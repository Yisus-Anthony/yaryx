import Image from "next/image";
import styles from "./page.module.css";
import ButtonLink from "../components/ui/ButtonLink/ButtonLink";

console.log("page.module.css keys:", Object.keys(styles));
console.log("pulseWrapper:", styles.pulseWrapper);

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Refacciones nuevas y usadas <br />
          para tu vehículo
        </h1>

        <p className={styles.subtitle}>
          Marchas y alternadores importados desde Estados Unidos
        </p>

        <div className={styles.ctaRow}>
          <div className={styles.ctaAnimation}>
            <ButtonLink href="/products" variant="primary">
              Nuestros productos
            </ButtonLink>
          </div>
          {/*<ButtonLink href="/about" variant="ghost">
            Sobre nosotros
          </ButtonLink>*/}
          {/*<div>
            <ButtonLink href="https://yaryx.com" external variant="ghost">
              Haz crecer tu negocio
            </ButtonLink>
          </div>*/}
        </div>
      </div>
      <div className={styles.grid}>
        <article className={styles.surface}>
          <Image
            src="/images/marchas.png"
            alt="Marchas para reconstruir"
            fill
            style={{ objectFit: "cover" }}
          />

          <div className={styles.overlay}>
            <h3>Marchas para reconstruir</h3>
            <p>a los mejores precios</p>
          </div>
        </article>

        <article className={styles.surface}>
          <Image
            src="/images/servicio-electrico.png"
            alt="Servicio eléctrico automotriz"
            fill
            style={{ objectFit: "cover" }}
          />

          <div className={styles.overlay}>
            <h3>Servicio eléctrico</h3>
            <p>diagnóstico y reparación</p>
          </div>
        </article>

        <article className={styles.surface}>
          <Image
            src="/images/alternadores.png"
            alt="Alternadores nuevos y usados"
            fill
            style={{ objectFit: "cover" }}
          />

          <div className={styles.overlay}>
            <h3>Alternadores</h3>
            <p>nuevos y usados</p>
          </div>
        </article>
      </div>
    </section>
  );
}
