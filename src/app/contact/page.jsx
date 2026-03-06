// src/app/contact/page.jsx

import ButtonLink from "../../components/ButtonLink/ButtonLink";
import ContactForm from "./_components/ContactForm";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const metadata = {
  title: "Contacto",
  description: "Formulario de contacto",
};

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

// Evita que lo que escriba el cliente se interprete como HTML dentro del email
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// SERVER ACTION (compatible con useFormState)
async function submitContact(prevState, formData) {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  // Validación básica
  if (!name || !email || !subject || !message) {
    return { ok: false, error: "Completa todos los campos." };
  }

  // Validación simple de email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Ingresa un email válido." };
  }

  try {
    // 1) Guardar en DB
    await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    // 2) Enviar correo (OBLIGATORIO + profesional)
    const to = (process.env.CONTACT_TO_EMAIL || "").trim();
    const fromEmail = (process.env.CONTACT_FROM_EMAIL || "").trim();
    const key = (process.env.RESEND_API_KEY || "").trim();

    if (!key) return { ok: false, error: "Config faltante: RESEND_API_KEY" };
    if (!to) return { ok: false, error: "Config faltante: CONTACT_TO_EMAIL" };
    if (!fromEmail)
      return { ok: false, error: "Config faltante: CONTACT_FROM_EMAIL" };

    const result = await resend.emails.send({
      from: `Tu Refaccionaria <${fromEmail}>`,
      to,
      replyTo: email,
      subject: `Consulta desde tu sitio web — ${subject}`,
      text:
        `Nuevo mensaje desde tu web\n\n` +
        `Nombre: ${name}\n` +
        `Email: ${email}\n` +
        `Asunto: ${subject}\n\n` +
        `Mensaje:\n${message}\n`,
      html: `
        <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.5">
          <h2 style="margin:0 0 12px">Nuevo mensaje desde tu web</h2>
          <p style="margin:0 0 6px"><b>Nombre:</b> ${escapeHtml(name)}</p>
          <p style="margin:0 0 6px"><b>Email:</b> ${escapeHtml(email)}</p>
          <p style="margin:0 0 6px"><b>Asunto:</b> ${escapeHtml(subject)}</p>
          <hr style="margin:16px 0; border:none; border-top:1px solid #e5e7eb" />
          <p style="margin:0 0 8px"><b>Mensaje:</b></p>
          <p style="margin:0; white-space:pre-wrap">${escapeHtml(message)}</p>
        </div>
      `,
    });

    // Resend devuelve { data, error }
    if (result?.error) {
      console.error("RESEND_ERROR:", result.error);
      return { ok: false, error: "No se pudo enviar el correo (Resend)." };
    }

    return { ok: true, error: "" };
  } catch (error) {
    console.error("CONTACT_SUBMIT_ERROR:", error);
    return { ok: false, error: "Error al enviar el mensaje." };
  }
}

export default function ContactPage() {
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 720 }}>
      <ButtonLink href="/" variant="ghost">
        ← Volver
      </ButtonLink>

      <header>
        <h1>Contacto</h1>
        <p>Cuéntanos qué necesitas y te respondemos lo antes posible.</p>
      </header>

      <ContactForm action={submitContact} />
    </div>
  );
}
