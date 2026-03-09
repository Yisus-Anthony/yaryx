import Link from "next/link";
import styles from "./products.module.css";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { getProductCategories, getProducts } from "@/lib/services/products";

type SearchParams = {
  page?: string;
  condition?: string;
  category?: string;
};

type ProductsPageProps = {
  searchParams?: Promise<SearchParams>;
};

type BuildUrlParams = {
  page?: number;
  condition?: string;
  category?: string;
};

function cldUrl(publicId: string): string {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_500,c_fill/${publicId}`;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = (await searchParams) ?? {};

  const pageParam = Number(params.page ?? "1");
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const condition = (params.condition ?? "all").toLowerCase();
  const category = (params.category ?? "all").toLowerCase();

  const [data, categories] = await Promise.all([
    getProducts({ page, condition, category }),
    getProductCategories(),
  ]);

  const visible = data.items;
  const total = data.total;
  const totalPages = data.totalPages;
  const currentPage = data.page;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  function buildUrl(next: BuildUrlParams): string {
    const params = new URLSearchParams();

    if (next.page && next.page > 1) {
      params.set("page", String(next.page));
    }

    if (next.condition && next.condition !== "all") {
      params.set("condition", next.condition);
    }

    if (next.category && next.category !== "all") {
      params.set("category", next.category);
    }

    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  }

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
                condition === "remanufacturado" ? styles.activePill : ""
              }`}
              href={buildUrl({
                page: 1,
                condition: "remanufacturado",
                category,
              })}
            >
              Remanufacturado
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
          <article key={p.slug} className={styles.card}>
            <Link href={`/products/${p.slug}`} className={styles.cardLink}>
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

            <div className={styles.cardActions}>
              <AddToCartButton productId={p.id} />
            </div>
          </article>
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
