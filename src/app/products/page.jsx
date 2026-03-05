import Link from "next/link";
import styles from "./products.module.css";

function cldUrl(publicId) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_500,c_fill/${publicId}`;
}

const PAGE_SIZE = 20;

async function getProducts({ page, condition, category }) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(PAGE_SIZE));
  if (condition && condition !== "all") params.set("condition", condition);
  if (category && category !== "all") params.set("category", category);

  // URL base robusta (dev/prod)
  const base =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const res = await fetch(`${base}/api/products?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("No se pudieron cargar productos");
  return res.json();
}

export default async function ProductsPage({ searchParams }) {
  const pageParam = Number(searchParams?.page ?? "1");
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const condition = (searchParams?.condition ?? "all").toLowerCase();
  const category = (searchParams?.category ?? "all").toLowerCase();

  const data = await getProducts({ page, condition, category });
  const visible = data.items || [];
  const total = data.total || 0;
  const totalPages = data.totalPages || 1;
  const currentPage = data.page || 1;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

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

  // categorías básicas: derivadas de los visibles
  // (si quieres categorías globales, te paso el cambio en la API)
  const categories = Array.from(
    new Set(visible.map((p) => (p.category || "").toLowerCase())),
  )
    .filter(Boolean)
    .sort();

  return (
    <section className={styles.wrapper}>
      <Link href="/" className={styles.backButton}>
        ← Atrás
      </Link>

      <h1 className={styles.title}>Productos</h1>

      <details className={styles.filtersDrawer}>
        <summary className={styles.filtersBtn}>
          ☰ Filtros
          <span className={styles.filtersState}>
            {condition !== "all" ? ` • ${condition}` : ""}
            {category !== "all" ? ` • ${category}` : ""}
          </span>
        </summary>

        <div className={styles.filtersPanel}>
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
              <p className={styles.price}>
                ${Number(p.price).toLocaleString("es-MX")}
              </p>
              <span className={styles.muted}>Ver más fotos →</span>
            </div>
          </Link>
        ))}
      </div>

      {total === 0 && (
        <div className={styles.empty}>No hay productos para esos filtros.</div>
      )}

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
