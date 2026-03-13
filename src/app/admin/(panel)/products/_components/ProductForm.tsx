"use client";

import { useEffect, useState } from "react";
import styles from "./ProductForm.module.css";

type VehicleTypeOption = {
  id: string;
  name: string;
};

type CategoryOption = {
  id: string;
  name: string;
};

type ProductInput = {
  id?: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  folder: string;
  coverPublicId: string;
  condition: string;
  categoryId: string;
  price: number;
  stock: number;
  isActive: boolean;
  vehicleTypeIds: string[];
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductForm({
  initial,
  categories,
  vehicleTypes,
  onSave,
  onDelete,
}: {
  initial: ProductInput;
  categories: CategoryOption[];
  vehicleTypes: VehicleTypeOption[];
  onSave: (data: ProductInput) => Promise<{ ok: boolean; error?: string }>;
  onDelete?: () => Promise<{ ok: boolean; error?: string }>;
}) {
  const [data, setData] = useState<ProductInput>(initial);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));

  useEffect(() => {
    setData(initial);
    setSlugTouched(Boolean(initial.slug));
  }, [initial]);

  function setField<K extends keyof ProductInput>(
    key: K,
    value: ProductInput[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function toggleVehicleType(id: string) {
    setData((prev) => ({
      ...prev,
      vehicleTypeIds: prev.vehicleTypeIds.includes(id)
        ? prev.vehicleTypeIds.filter((item) => item !== id)
        : [...prev.vehicleTypeIds, id],
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);

    const normalizedCondition = String(data.condition).trim().toUpperCase();

    if (!["NEW", "USED", "REFURBISHED"].includes(normalizedCondition)) {
      setBusy(false);
      setMsg({ type: "err", text: "Condición inválida" });
      return;
    }

    if (Number(data.price) < 0) {
      setBusy(false);
      setMsg({ type: "err", text: "El precio no puede ser negativo" });
      return;
    }

    if (Number(data.stock) < 0) {
      setBusy(false);
      setMsg({ type: "err", text: "El stock no puede ser negativo" });
      return;
    }

    const res = await onSave({
      ...data,
      sku: data.sku.trim().toUpperCase(),
      slug: data.slug.trim().toLowerCase(),
      name: data.name.trim(),
      description: data.description.trim(),
      folder: data.folder.trim(),
      coverPublicId: data.coverPublicId.trim(),
      condition: normalizedCondition,
      categoryId: data.categoryId.trim(),
      price: Number(data.price),
      stock: Number(data.stock),
      isActive: Boolean(data.isActive),
      vehicleTypeIds: data.vehicleTypeIds,
    });

    setBusy(false);
    setMsg(
      res.ok
        ? { type: "ok", text: "Guardado correctamente" }
        : { type: "err", text: res.error || "Error al guardar" },
    );
  }

  async function del() {
    if (!onDelete) return;
    if (!confirm("¿Seguro que quieres borrar este producto?")) return;

    setBusy(true);
    setMsg(null);

    const res = await onDelete();

    setBusy(false);
    setMsg(
      res.ok
        ? { type: "ok", text: "Borrado correctamente" }
        : { type: "err", text: res.error || "Error al borrar" },
    );
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Nombre
        </label>
        <input
          id="name"
          className={styles.input}
          value={data.name}
          onChange={(e) => {
            const nextName = e.target.value;
            setField("name", nextName);

            if (!slugTouched) {
              setField("slug", slugify(nextName));
            }
          }}
          required
        />
      </div>

      <div className={styles.gridTwo}>
        <div className={styles.field}>
          <label htmlFor="sku" className={styles.label}>
            SKU
          </label>
          <input
            id="sku"
            className={styles.input}
            value={data.sku}
            onChange={(e) => setField("sku", e.target.value)}
            placeholder="Ej. ALT-0001"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="slug" className={styles.label}>
            Slug
          </label>
          <input
            id="slug"
            className={styles.input}
            value={data.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setField("slug", slugify(e.target.value));
            }}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Descripción
        </label>
        <textarea
          id="description"
          className={styles.textarea}
          value={data.description}
          onChange={(e) => setField("description", e.target.value)}
          rows={5}
          placeholder="Describe el producto, compatibilidad, material, marca, etc."
        />
      </div>

      <div className={styles.gridTwo}>
        <div className={styles.field}>
          <label htmlFor="categoryId" className={styles.label}>
            Categoría
          </label>
          <select
            id="categoryId"
            className={styles.select}
            value={data.categoryId}
            onChange={(e) => setField("categoryId", e.target.value)}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="condition" className={styles.label}>
            Condición
          </label>
          <select
            id="condition"
            className={styles.select}
            value={data.condition}
            onChange={(e) => setField("condition", e.target.value)}
            required
          >
            <option value="NEW">Nuevo</option>
            <option value="USED">Usado</option>
            <option value="REFURBISHED">Remanufacturado</option>
          </select>
        </div>
      </div>

      <div className={styles.gridTwo}>
        <div className={styles.field}>
          <label htmlFor="price" className={styles.label}>
            Precio (MXN)
          </label>
          <input
            id="price"
            className={styles.input}
            type="number"
            min="0"
            step="1"
            value={data.price}
            onChange={(e) => setField("price", Number(e.target.value))}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="stock" className={styles.label}>
            Stock
          </label>
          <input
            id="stock"
            className={styles.input}
            type="number"
            min="0"
            step="1"
            value={data.stock}
            onChange={(e) => setField("stock", Number(e.target.value))}
            required
          />
        </div>
      </div>

      <div className={styles.gridTwo}>
        <div className={styles.field}>
          <label htmlFor="folder" className={styles.label}>
            Folder (Cloudinary prefix)
          </label>
          <input
            id="folder"
            className={styles.input}
            value={data.folder}
            onChange={(e) => setField("folder", e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="coverPublicId" className={styles.label}>
            Cover Public ID
          </label>
          <input
            id="coverPublicId"
            className={styles.input}
            value={data.coverPublicId}
            onChange={(e) => setField("coverPublicId", e.target.value)}
            required
          />
        </div>
      </div>

      <label className={styles.checkRow}>
        <input
          type="checkbox"
          checked={data.isActive}
          onChange={(e) => setField("isActive", e.target.checked)}
        />
        <span>Producto activo</span>
      </label>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Tipos de vehículo compatibles</legend>

        {!vehicleTypes.length ? (
          <p className={styles.emptyText}>No hay tipos de vehículo creados.</p>
        ) : (
          <div className={styles.checks}>
            {vehicleTypes.map((vehicleType) => (
              <label key={vehicleType.id} className={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={data.vehicleTypeIds.includes(vehicleType.id)}
                  onChange={() => toggleVehicleType(vehicleType.id)}
                />
                <span>{vehicleType.name}</span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <div className={styles.actions}>
        <button disabled={busy} type="submit" className={styles.primaryButton}>
          {busy ? "Guardando..." : "Guardar"}
        </button>

        {onDelete ? (
          <button
            disabled={busy}
            type="button"
            onClick={del}
            className={styles.dangerButton}
          >
            Borrar
          </button>
        ) : null}
      </div>

      {msg ? (
        <div
          className={`${styles.message} ${
            msg.type === "ok" ? styles.success : styles.error
          }`}
        >
          {msg.text}
        </div>
      ) : null}
    </form>
  );
}
