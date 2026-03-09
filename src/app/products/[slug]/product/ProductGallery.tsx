"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "../product.module.css";

type ProductImage = {
  id: string | number;
  publicId: string;
};

type ProductImagesResponse = {
  items?: ProductImage[];
};

type ProductGalleryProps = {
  slug: string;
};

function cldThumb(publicId: string): string {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto:eco,w_350,c_fill/${publicId}`;
}

function cldFull(publicId: string): string {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto:good,w_1400,c_fit/${publicId}`;
}

export default function ProductGallery({ slug }: ProductGalleryProps) {
  const [items, setItems] = useState<ProductImage[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [openIndex, setOpenIndex] = useState(-1);
  const isOpen = openIndex >= 0;

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
            const err: { detail?: string; error?: string } = await res.json();
            msg = err?.detail || err?.error || msg;
          } catch {
            // ignorar parse error
          }

          throw new Error(msg);
        }

        const data: ProductImagesResponse = await res.json();

        if (alive) {
          setItems(data.items || []);
        }
      } catch (e: unknown) {
        if (alive) {
          const message = e instanceof Error ? e.message : "Error";
          setError(message);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, [slug]);

  const close = useCallback(() => setOpenIndex(-1), []);

  const next = useCallback(() => {
    if (items.length === 0) return;
    setOpenIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    if (items.length === 0) return;
    setOpenIndex((i) => (i - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close, next, prev]);

  if (loading) return <div className={styles.muted}>Cargando imágenes...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!items.length) return <div className={styles.muted}>Sin imágenes</div>;

  const active = isOpen ? items[openIndex] : null;

  return (
    <>
      <div className={styles.grid}>
        {items.map((img, idx) => (
          <button
            key={img.id}
            type="button"
            className={styles.itemButton}
            onClick={() => setOpenIndex(idx)}
            aria-label={`Ver imagen ${idx + 1}`}
          >
            <img
              className={styles.thumb}
              src={cldThumb(img.publicId)}
              alt={img.publicId}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {isOpen && active && (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalClose}
              onClick={close}
              aria-label="Cerrar"
            >
              ✕
            </button>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  className={styles.modalPrev}
                  onClick={prev}
                  aria-label="Anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className={styles.modalNext}
                  onClick={next}
                  aria-label="Siguiente"
                >
                  ›
                </button>
              </>
            )}

            <img
              className={styles.full}
              src={cldFull(active.publicId)}
              alt={active.publicId}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
