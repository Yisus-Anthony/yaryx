"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const res = await signIn("credentials", {
      email,
      callbackUrl: "/admin/products",
      redirect: true,
    });
    // redirect:true usualmente no regresa aquí, pero por si acaso:
    if ((res as any)?.error) setErr("No autorizado");
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Admin Login</h1>
      <p>Solo el correo configurado en ADMIN_EMAIL puede entrar.</p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          required
          style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
        />
        <button type="submit" style={{ padding: 10, borderRadius: 8 }}>
          Entrar
        </button>
        {err ? <div style={{ color: "crimson" }}>{err}</div> : null}
      </form>
    </main>
  );
}
