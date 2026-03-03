import styles from "./page.module.css";
import ButtonLink from "../components/ButtonLink/ButtonLink";

console.log("page.module.css keys:", Object.keys(styles));
console.log("pulseWrapper:", styles.pulseWrapper);

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          En Tu Refaccionaria encontraras refacciones nuevas y usadas para tu
          vehivulo
        </h1>
        <p className={styles.subtitle}>
          Marchas, Alternadores importados desde estados unidos
        </p>

        <div className={styles.ctaRow}>
          <div className={styles.ctaAnimation}>
            <ButtonLink href="/products" variant="primary">
              Nuestros productos
            </ButtonLink>
          </div>
          <ButtonLink href="/about" variant="ghost">
            Sobre nosotros
          </ButtonLink>
          <div>
            <ButtonLink href="https://yaryx.com" external variant="ghost">
              Haz crecer tu negocio
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <article className={styles.surface}>
          <h3>Conoce nuestros motores de arranque</h3>
          <p>a los mejores precios nuevos y usados</p>
        </article>
        <article className={styles.surface}>
          <h3>Hasta 50 % de descuento</h3>
          <p>
            Pongase en contacto con nosotros y pregunte acerca de los
            descuentos.
          </p>
        </article>
        <article className={styles.surface}>
          <h3>Alternadores</h3>
          <p>a los mejores precios nuevos y usados.</p>
        </article>
      </div>
    </section>
  );
}
