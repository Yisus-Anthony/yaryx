"use client";

import styles from "./WhatsAppButton.module.css";

export default function WhatsAppButton({ notificationCount = 1 }) {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
  const message =
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || "Hola, quiero más información";

  // Validación profesional: no renderiza si no hay número
  if (!phoneNumber) {
    if (process.env.NODE_ENV === "development") {
      console.warn("NEXT_PUBLIC_WHATSAPP_PHONE no está definido en .env.local");
    }
    return null;
  }

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappButton}
      aria-label="Chat en WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className={styles.icon}
      >
        <path
          fill="white"
          d="M16 2.7C8.7 2.7 2.8 8.6 2.8 15.9c0 2.6.8 5.1 2.2 7.2L3 29.3l6.4-2c2 .9 4.2 1.4 6.6 1.4 7.3 0 13.2-5.9 13.2-13.2S23.3 2.7 16 2.7zm0 23.9c-2.1 0-4.1-.6-5.8-1.6l-.4-.2-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.7-1.9-3.7-1.9-5.9 0-5.9 4.8-10.7 10.7-10.7S26.7 10 26.7 15.9 21.9 26.6 16 26.6zm5.9-8.1c-.3-.2-1.7-.8-1.9-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.2-1.5-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.4.3-.6.1-.2 0-.5 0-.7s-.7-1.6-.9-2.2c-.3-.6-.6-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.6s1.2 3 1.4 3.2c.2.3 2.4 3.7 5.9 5 .8.3 1.4.5 1.9.6.8.2 1.5.2 2 .1.6-.1 1.7-.7 1.9-1.3.2-.6.2-1.1.2-1.3 0-.2-.2-.3-.5-.5z"
        />
      </svg>

      {notificationCount > 0 && (
        <span className={styles.badge}>{notificationCount}</span>
      )}
    </a>
  );
}
