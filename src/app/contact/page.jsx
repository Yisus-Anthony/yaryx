import ButtonLink from "../../components/ButtonLink/ButtonLink";

export default function ContactPage() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1>Contact</h1>
      <p style={{ color: "var(--muted)", margin: 0 }}>
        Aquí podrías poner un formulario (server actions / API route) cuando lo necesites.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <ButtonLink href="/" variant="ghost">Volver</ButtonLink>
        <ButtonLink href="mailto:hello@ejemplo.com" external variant="primary">
          Enviar email
        </ButtonLink>
      </div>
    </div>
  );
}