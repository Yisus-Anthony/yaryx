import ButtonLink from "../../components/ui/ButtonLink/ButtonLink";

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

      <h1>Sobre Nosotros</h1>

      <p style={{ color: "var(--muted)", margin: 0 }}>
        En <strong>Tu Refaccionaria</strong> nos especializamos en la venta de
        refacciones automotrices, principalmente marchas y alternadores nuevos y
        usados importados desde Estados Unidos. Nuestro objetivo es ofrecer
        piezas confiables a precios accesibles para que tu vehículo vuelva a
        funcionar correctamente sin gastar de más.
      </p>

      <section style={{ display: "grid", gap: 8 }}>
        <h2>Nuestra Historia</h2>
        <p style={{ margin: 0 }}>
          Tu Refaccionaria nace con la idea de brindar una alternativa confiable
          para quienes buscan refacciones de calidad a buen precio. Con el paso
          del tiempo hemos trabajado con distintos proveedores y talleres
          automotrices para garantizar piezas funcionales, revisadas y listas
          para instalar.
        </p>
      </section>

      <section style={{ display: "grid", gap: 8 }}>
        <h2>Misión</h2>
        <p style={{ margin: 0 }}>
          Ofrecer refacciones automotrices confiables y accesibles, brindando un
          servicio rápido y honesto que ayude a nuestros clientes a mantener sus
          vehículos en buen estado.
        </p>

        <h2>Visión</h2>
        <p style={{ margin: 0 }}>
          Convertirnos en una refaccionaria reconocida por la calidad de
          nuestras piezas y la confianza que brindamos a nuestros clientes en
          cada compra.
        </p>
      </section>

      <section style={{ display: "grid", gap: 8 }}>
        <h2>Valores</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Honestidad en cada venta</li>
          <li>Compromiso con la calidad</li>
          <li>Atención cercana al cliente</li>
          <li>Precios justos y competitivos</li>
        </ul>
      </section>

      <section style={{ display: "grid", gap: 8 }}>
        <h2>Lo que ofrecemos</h2>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Marchas nuevas y usadas</li>
          <li>Alternadores importados</li>
          <li>Piezas revisadas y funcionales</li>
          <li>Asesoría para encontrar la refacción correcta</li>
        </ul>
      </section>

      <div
        style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}
      >
        <ButtonLink href="/contact" variant="primary">
          Contáctanos
        </ButtonLink>

        <ButtonLink href="/products" variant="ghost">
          Ver productos
        </ButtonLink>
      </div>
    </div>
  );
}
