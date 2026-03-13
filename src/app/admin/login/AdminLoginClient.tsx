"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

type Props = {
  callbackUrl: string;
};

export default function AdminLoginClient({ callbackUrl }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setBusy(true);

    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setBusy(false);

    if (res?.error) {
      setErr("Correo o contraseña inválidos");
      return;
    }

    window.location.href = callbackUrl;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          display: "grid",
          gap: 14,
          padding: 24,
          border: "1px solid #ddd",
          borderRadius: 16,
          background: "#fff",
        }}
      >
        <h1 style={{ margin: 0 }}>Admin login</h1>
        <p style={{ margin: 0, color: "#555" }}>
          Ingresa con tu correo y contraseña de administrador.
        </p>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Correo</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu-correo@gmail.com"
            required
            style={{
              height: 44,
              borderRadius: 10,
              border: "1px solid #ccc",
              padding: "0 12px",
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            style={{
              height: 44,
              borderRadius: 10,
              border: "1px solid #ccc",
              padding: "0 12px",
            }}
          />
        </label>

        {err ? <div style={{ color: "crimson" }}>{err}</div> : null}

        <button
          type="submit"
          disabled={busy}
          style={{
            height: 46,
            borderRadius: 10,
            border: "1px solid #ccc",
            cursor: "pointer",
            fontWeight: 700,
            background: "#111",
            color: "#fff",
          }}
        >
          {busy ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
