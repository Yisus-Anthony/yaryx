"use client";

import { useEffect, useState } from "react";
import styles from "./product.module.css";

export default function ProductGallery({ slug }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `/api/products/product-images?slug=${encodeURIComponent(slug)}`,
        );
        if (!res.ok) {
          let msg = `Error ${res.status}`;
          try {
            const err = await res.json();
            msg = err?.detail || err?.error || msg;
          } catch {}
          throw new Error(msg);
        }

        const data = await res.json();

        if (alive) setItems(data.items || []);
      } catch (e) {
        if (alive) setError(e.message || "Error");
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) return <div className={styles.muted}>Cargando imágenes...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!items.length) return <div className={styles.muted}>Sin imágenes</div>;

  return (
    <div className={styles.grid}>
      {items.map((img) => (
        <a
          key={img.id}
          className={styles.item}
          href={img.url}
          target="_blank"
          rel="noreferrer"
        >
          <img
            className={styles.thumb}
            src={img.url}
            alt={img.publicId}
            loading="lazy"
          />
        </a>
      ))}
    </div>
  );
}
