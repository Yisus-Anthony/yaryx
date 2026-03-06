"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        padding: "12px 16px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.14)",
        background: pending
          ? "rgba(255,255,255,0.05)"
          : "rgba(255,255,255,0.08)",
        color: "inherit",
        cursor: pending ? "not-allowed" : "pointer",
        fontWeight: 600,
        opacity: pending ? 0.7 : 1,
      }}
    >
      {pending ? "Enviando..." : "Enviar mensaje"}
    </button>
  );
}

const initialState = { ok: null, error: "" };

export default function ContactForm({ action }) {
  const [state, formAction] = useFormState(action, initialState);

  const formRef = useRef(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state?.ok === true) {
      setShowSuccess(true);

      // limpiar formulario
      formRef.current?.reset();

      // ocultar mensaje después de 4 segundos
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} style={styles.card}>
      <div style={styles.grid2}>
        <Field label="Nombre" name="name" placeholder="Tu nombre" />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="tu@email.com"
        />
      </div>

      <Field label="Asunto" name="subject" placeholder="Ej. Cotización" />

      <Field
        label="Mensaje"
        name="message"
        placeholder="Escribe tu mensaje..."
        isTextArea
      />

      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <SubmitButton />
          <span style={styles.helper}>Te responderemos por email.</span>
        </div>

        {showSuccess && (
          <div style={styles.success}>✅ Mensaje enviado correctamente.</div>
        )}

        {state?.ok === false && (
          <div style={styles.error}>
            ⚠️ {state.error || "Ocurrió un error."}
          </div>
        )}

        <p style={styles.privacy}>
          Al enviar aceptas que usemos tus datos únicamente para responder tu
          solicitud.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  isTextArea = false,
}) {
  return (
    <label style={styles.label}>
      <span style={styles.labelText}>{label}</span>
      {isTextArea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          required
          rows={6}
          style={styles.textarea}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required
          style={styles.input}
        />
      )}
    </label>
  );
}

const styles = {
  card: {
    display: "grid",
    gap: 14,
    padding: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
  },
  grid2: {
    display: "grid",
    gap: 14,
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  label: { display: "grid", gap: 6 },
  labelText: { fontSize: 13, color: "var(--muted)" },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.15)",
    color: "inherit",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.15)",
    color: "inherit",
    resize: "vertical",
  },
  helper: { fontSize: 13, color: "var(--muted)" },
  privacy: { margin: 0, fontSize: 12, color: "var(--muted)" },
  success: {
    padding: 12,
    borderRadius: 10,
    background: "rgba(34,197,94,0.15)",
    border: "1px solid rgba(34,197,94,0.25)",
  },
  error: {
    padding: 12,
    borderRadius: 10,
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.25)",
  },
};
