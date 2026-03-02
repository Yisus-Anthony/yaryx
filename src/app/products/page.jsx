import Link from "next/link";
import { products } from "../../data/products";
import styles from "./products.module.css";

function cldUrl(publicId) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_500,c_fill/${publicId}`;
}

const PAGE_SIZE = 20;

export default function ProductsPage({ searchParams }) {
  // page viene de la URL: /products?page=2
  const page = Number(searchParams?.page ?? "1");
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;

  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const currentPage = Math.min(safePage, totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const visible = products.slice(start, end);

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <section className={styles.wrapper}>
      <Link href="/" className={styles.backButton}>
        ← Atras
      </Link>

      <h1 className={styles.title}>Productos</h1>

      <div className={styles.grid}>
        {visible.map((p) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className={styles.card}
          >
            <img
              className={styles.thumb}
              src={cldUrl(p.coverPublicId)}
              alt={p.name}
            />
            <div className={styles.cardBody}>
              <h3 className={styles.name}>{p.name}</h3>
              <span className={styles.muted}>Ver más fotos →</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Paginación */}
      <div className={styles.pagination}>
        {prevPage ? (
          <Link className={styles.pageBtn} href={`/products?page=${prevPage}`}>
            ← Anterior
          </Link>
        ) : (
          <span className={styles.pageBtnDisabled}>← Anterior</span>
        )}

        <span className={styles.pageInfo}>
          Página {currentPage} de {totalPages}
        </span>

        {nextPage ? (
          <Link className={styles.pageBtn} href={`/products?page=${nextPage}`}>
            Siguiente →
          </Link>
        ) : (
          <span className={styles.pageBtnDisabled}>Siguiente →</span>
        )}
      </div>
    </section>
  );
}
