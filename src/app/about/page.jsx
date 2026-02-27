import ButtonLink from "../../components/ButtonLink/ButtonLink";

export default function AboutPage() {
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 900 }}>
      <div
        style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}
      >
        <ButtonLink href="/" variant="ghost">
          inicio
        </ButtonLink>
      </div>
      <h1>Acerca de Nosotros</h1>

      <p style={{ color: "var(--muted)", margin: 0 }}>
        Somos una empresa enfocada en desarrollar soluciones digitales modernas,
        escalables y centradas en el usuario.
      </p>

      {/* Historia */}
      <section style={{ display: "grid", gap: 8 }}>
        <h2>Nuestra Historia</h2>
        <p style={{ margin: 0 }}>
          Nacimos con el objetivo de ayudar a empresas y emprendedores a
          transformar sus ideas en productos digitales reales. Con el tiempo,
          hemos consolidado procesos eficientes y un enfoque basado en calidad,
          rendimiento y experiencia de usuario.
        </p>
      </section>

      {/* Misión y Visión */}
      <section style={{ display: "grid", gap: 8 }}>
        <h2>Misión</h2>
        <p style={{ margin: 0 }}>
          Crear soluciones tecnológicas que generen impacto, optimicen procesos
          y aporten valor sostenible a nuestros clientes.
        </p>

        <h2>Visión</h2>
        <p style={{ margin: 0 }}>
          Convertirnos en un referente en el desarrollo de productos digitales
          innovadores a nivel nacional e internacional.
        </p>
      </section>

      {/* Valores */}
      <section style={{ display: "grid", gap: 8 }}>
        <h2>Valores</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Compromiso con la excelencia</li>
          <li>Innovación constante</li>
          <li>Transparencia y ética profesional</li>
          <li>Enfoque centrado en el cliente</li>
        </ul>
      </section>

      {/* Métricas */}
      <section style={{ display: "grid", gap: 8 }}>
        <h2>En Números</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>+5 años de experiencia</li>
          <li>+100 proyectos completados</li>
          <li>95% de satisfacción de clientes</li>
        </ul>
      </section>

      {/* Botones */}
      <div
        style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}
      >
        <ButtonLink href="/contacto" variant="primary">
          Contáctanos
        </ButtonLink>

        <ButtonLink href="https://nextjs.org/docs" external variant="primary">
          Leer Docs
        </ButtonLink>
      </div>
    </div>
  );
}
