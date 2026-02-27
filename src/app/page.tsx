import styles from "./page.module.css";
import ButtonLink from "../components/ButtonLink/ButtonLink";

console.log("page.module.css keys:", Object.keys(styles));
console.log("pulseWrapper:", styles.pulseWrapper);

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <div className={styles.card}>
        <h1 className={styles.title}>App Next.js mantenible y escalable</h1>
        <p className={styles.subtitle}>
          Componentes por feature + CSS Modules por componente + tokens globales
          mínimos.
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
          <div className={styles.ctaAnimation}>
            <ButtonLink href="https://yaryx.com" external variant="ghost">
              Haz crecer tu negocio
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <article className={styles.surface}>
          <h3>Escalable</h3>
          <p>
            Crece por módulos: components/feature, app/routes, styles/tokens.
          </p>
        </article>
        <article className={styles.surface}>
          <h3>Responsivo</h3>
          <p>Grid/Flex + breakpoints claros y consistentes.</p>
        </article>
        <article className={styles.surface}>
          <h3>Mantenible</h3>
          <p>
            Separación de responsabilidades: UI, rutas y estilos encapsulados.
          </p>
        </article>
      </div>
    </section>
  );
}
