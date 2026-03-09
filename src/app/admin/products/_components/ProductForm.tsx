"use client";

import { useState } from "react";

type ProductInput = {
  id?: string;
  slug: string;
  name: string;
  folder: string;
  coverPublicId: string;
  condition: string;
  categoryId: string;
  price: number;
};

export default function ProductForm({
  initial,
  onSave,
  onDelete,
}: {
  initial: ProductInput;
  onSave: (data: ProductInput) => Promise<{ ok: boolean; error?: string }>;
  onDelete?: () => Promise<{ ok: boolean; error?: string }>;
}) {
  const [data, setData] = useState<ProductInput>(initial);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);

    const conditionMap: Record<string, string> = {
      nuevo: "NEW",
      nuevos: "NEW",
      used: "USED",
      usado: "USED",
      usados: "USED",
      remanufacturado: "REFURBISHED",
      remanufacturados: "REFURBISHED",
      refurbished: "REFURBISHED",
    };

    const rawCondition = data.condition.trim().toLowerCase();
    const mappedCondition = conditionMap[rawCondition];

    if (!mappedCondition) {
      setBusy(false);
      setMsg({ type: "err", text: "Condición inválida" });
      return;
    }

    const res = await onSave({
      ...data,
      slug: data.slug.trim().toLowerCase(),
      name: data.name.trim(),
      folder: data.folder.trim(),
      coverPublicId: data.coverPublicId.trim(),
      condition: mappedCondition,
      categoryId: data.categoryId.trim(),
      price: Number(data.price),
    });

    setBusy(false);
    setMsg(
      res.ok
        ? { type: "ok", text: "Guardado" }
        : { type: "err", text: res.error || "Error" },
    );
  }

  async function del() {
    if (!onDelete) return;
    if (!confirm("¿Borrar producto?")) return;
    setMsg(null);
    setBusy(true);
    const res = await onDelete();
    setBusy(false);
    setMsg(
      res.ok
        ? { type: "ok", text: "Borrado" }
        : { type: "err", text: res.error || "Error" },
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 640 }}>
      <label>
        Nombre
        <input
          value={data.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </label>

      <label>
        Slug (minúsculas, único)
        <input
          value={data.slug}
          onChange={(e) => set("slug", e.target.value)}
          required
        />
      </label>

      <label>
        Category ID
        <input
          value={data.categoryId}
          onChange={(e) => set("categoryId", e.target.value)}
          required
        />
      </label>

      <label>
        Condición (nuevo/usado/remanufacturado)
        <input
          value={data.condition}
          onChange={(e) => set("condition", e.target.value)}
          required
        />
      </label>

      <label>
        Precio (MXN)
        <input
          type="number"
          value={data.price}
          onChange={(e) => set("price", Number(e.target.value))}
          required
        />
      </label>

      <label>
        Folder (Cloudinary prefix)
        <input
          value={data.folder}
          onChange={(e) => set("folder", e.target.value)}
          required
        />
      </label>

      <label>
        Cover Public ID (Cloudinary)
        <input
          value={data.coverPublicId}
          onChange={(e) => set("coverPublicId", e.target.value)}
          required
        />
      </label>

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <button disabled={busy} type="submit">
          {busy ? "Guardando..." : "Guardar"}
        </button>

        {onDelete ? (
          <button
            disabled={busy}
            type="button"
            onClick={del}
            style={{ marginLeft: "auto" }}
          >
            Borrar
          </button>
        ) : null}
      </div>

      {msg ? (
        <div style={{ color: msg.type === "ok" ? "green" : "crimson" }}>
          {msg.text}
        </div>
      ) : null}

      <style jsx>{`
        input {
          display: block;
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin-top: 6px;
        }
        label {
          font-size: 14px;
        }
        button {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #ccc;
          background: #fff;
          cursor: pointer;
        }
      `}</style>
    </form>
  );
}
