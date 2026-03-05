import Link from "next/link";
import { products } from "../../data/products";
import styles from "./products.module.css";

function cldUrl(publicId) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_500,c_fill/${publicId}`;
}

const PAGE_SIZE = 20;

export default function ProductsPage({ searchParams }) {
  // ---- params desde la URL ----
  const pageParam = Number(searchParams?.page ?? "1");
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  // "all" | "nuevo" | "usado"
  const condition = (searchParams?.condition ?? "all").toLowerCase();

  // "all" | cualquier categoría
  const category = (searchParams?.category ?? "all").toLowerCase();

  // ---- categorías disponibles (auto) ----
  const categories = Array.from(
    new Set(
      products
        .map((p) => (p.category ?? "").toString().trim().toLowerCase())
        .filter(Boolean),
    ),
  ).sort();

  // ---- filtrar productos ----
  const filtered = products.filter((p) => {
    const pCondition = (p.condition ?? "").toString().trim().toLowerCase();
    const pCategory = (p.category ?? "").toString().trim().toLowerCase();

    const okCondition = condition === "all" ? true : pCondition === condition;
    const okCategory = category === "all" ? true : pCategory === category;

    return okCondition && okCategory;
  });

  // ---- paginar sobre filtered ----
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  // ---- helper para construir URLs conservando filtros ----
  function buildUrl(next) {
    const params = new URLSearchParams();

    if (next.page && next.page > 1) params.set("page", String(next.page));
    if (next.condition && next.condition !== "all")
      params.set("condition", next.condition);
    if (next.category && next.category !== "all")
      params.set("category", next.category);

    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  return (
    <section className={styles.wrapper}>
      <Link href="/" className={styles.backButton}>
        ← Atrás
      </Link>

      <h1 className={styles.title}>Productos</h1>

      {/* BOTÓN / MENÚ DE FILTROS */}
      <details className={styles.filtersDrawer}>
        <summary className={styles.filtersBtn}>
          ☰ Filtros
          <span className={styles.filtersState}>
            {condition !== "all" ? ` • ${condition}` : ""}
            {category !== "all" ? ` • ${category}` : ""}
          </span>
        </summary>

        <div className={styles.filtersPanel}>
          {/* Condición */}
          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>Condición:</span>

            <Link
              className={`${styles.filterPill} ${
                condition === "all" ? styles.activePill : ""
              }`}
              href={buildUrl({ page: 1, condition: "all", category })}
            >
              Todos
            </Link>

            <Link
              className={`${styles.filterPill} ${
                condition === "nuevo" ? styles.activePill : ""
              }`}
              href={buildUrl({ page: 1, condition: "nuevo", category })}
            >
              Nuevos
            </Link>

            <Link
              className={`${styles.filterPill} ${
                condition === "usado" ? styles.activePill : ""
              }`}
              href={buildUrl({ page: 1, condition: "usado", category })}
            >
              Usados
            </Link>
            <Link
              className={`${styles.filterPill} ${
                condition === "remanofacturado" ? styles.activePill : ""
              }`}
              href={buildUrl({
                page: 1,
                condition: "remanofacturado",
                category,
              })}
            >
              remanofacturado
            </Link>
          </div>

          {/* Categoría */}
          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>Categoría:</span>

            <Link
              className={`${styles.filterPill} ${
                category === "all" ? styles.activePill : ""
              }`}
              href={buildUrl({ page: 1, condition, category: "all" })}
            >
              Todas
            </Link>

            {categories.map((c) => (
              <Link
                key={c}
                className={`${styles.filterPill} ${
                  category === c ? styles.activePill : ""
                }`}
                href={buildUrl({ page: 1, condition, category: c })}
              >
                {c}
              </Link>
            ))}
          </div>

          <div className={styles.resultsInfo}>
            Mostrando {total} producto(s)
          </div>
        </div>
      </details>

      {/* -------- GRID -------- */}
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

              <p className={styles.price}>${p.price.toLocaleString("es-MX")}</p>

              <span className={styles.muted}>Ver más fotos →</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Si no hay resultados */}
      {total === 0 && (
        <div className={styles.empty}>No hay productos para esos filtros.</div>
      )}

      {/* -------- PAGINACIÓN -------- */}
      <div className={styles.pagination}>
        {prevPage ? (
          <Link
            className={styles.pageBtn}
            href={buildUrl({ page: prevPage, condition, category })}
          >
            ← Anterior
          </Link>
        ) : (
          <span className={styles.pageBtnDisabled}>← Anterior</span>
        )}

        <span className={styles.pageInfo}>
          Página {currentPage} de {totalPages}
        </span>

        {nextPage ? (
          <Link
            className={styles.pageBtn}
            href={buildUrl({ page: nextPage, condition, category })}
          >
            Siguiente →
          </Link>
        ) : (
          <span className={styles.pageBtnDisabled}>Siguiente →</span>
        )}
      </div>
    </section>
  );
}
