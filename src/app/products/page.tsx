import Link from "next/link";
import styles from "./products.module.css";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductsFilters from "./_components/ProductsFilters";
import { getProductFiltersMeta, getProducts } from "@/lib/services/products";

type ProductsPageProps = {
  searchParams?: {
    page?: string;
    q?: string;
    condition?: string;
    category?: string;
    vehicleType?: string;
  };
};

type BuildUrlParams = {
  page?: number;
  q?: string;
  condition?: string;
  category?: string;
  vehicleType?: string;
};

function cldUrl(publicId: string): string {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_500,c_fill/${publicId}`;
}

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): Array<number | "..."> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = searchParams ?? {};

  const parsedPage = Number(params.page ?? "1");
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const q = (params.q ?? "").trim();
  const condition = (params.condition ?? "all").toLowerCase();
  const category = (params.category ?? "all").toLowerCase();
  const vehicleType = (params.vehicleType ?? "all").toLowerCase();

  const [data, filtersMeta] = await Promise.all([
    getProducts({ page, q, condition, category, vehicleType }),
    getProductFiltersMeta(),
  ]);

  const visible = data.items;
  const total = data.total;
  const totalPages = Math.max(1, data.totalPages);
  const currentPage = Math.min(Math.max(1, data.page), totalPages);

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  function buildUrl(next: BuildUrlParams): string {
    const urlParams = new URLSearchParams();

    const nextPage = next.page;
    const nextQ = next.q ?? q;
    const nextCondition = next.condition ?? condition;
    const nextVehicleType = next.vehicleType ?? vehicleType;
    const nextCategory = next.category ?? category;

    if (nextPage && nextPage > 1) {
      urlParams.set("page", String(nextPage));
    }

    if (nextQ.trim()) {
      urlParams.set("q", nextQ.trim());
    }

    if (nextCondition !== "all") {
      urlParams.set("condition", nextCondition);
    }

    if (nextVehicleType !== "all") {
      urlParams.set("vehicleType", nextVehicleType);
    }

    if (nextCategory !== "all") {
      urlParams.set("category", nextCategory);
    }

    const qs = urlParams.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <section className={styles.wrapper}>
      <Link href="/" className={styles.backButton}>
        ← Atrás
      </Link>

      <h1 className={styles.title}>Productos</h1>

      <ProductsFilters
        q={q}
        condition={condition}
        category={category}
        vehicleType={vehicleType}
        total={total}
        conditionOptions={filtersMeta.conditions}
        vehicleTypeOptions={filtersMeta.vehicleTypes}
        categoryTree={filtersMeta.categories}
        buildUrl={buildUrl}
      />

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
        <div className={styles.empty}>
          No encontramos productos con los filtros o búsqueda actual. Si el
          producto no aparece en catálogo, pregunte por WhatsApp.
        </div>
      )}

      {total > 0 && totalPages > 1 && (
        <div className={styles.pagination}>
          {prevPage ? (
            <Link
              className={styles.pageBtn}
              href={buildUrl({ page: prevPage })}
            >
              ← Anterior
            </Link>
          ) : (
            <span className={styles.pageBtnDisabled}>← Anterior</span>
          )}

          <div className={styles.pageNumbers}>
            {paginationItems.map((item, index) =>
              item === "..." ? (
                <span key={`dots-${index}`} className={styles.pageDots}>
                  ...
                </span>
              ) : item === currentPage ? (
                <span key={item} className={styles.pageBtnActive}>
                  {item}
                </span>
              ) : (
                <Link
                  key={item}
                  className={styles.pageBtn}
                  href={buildUrl({ page: item })}
                >
                  {item}
                </Link>
              ),
            )}
          </div>

          {nextPage ? (
            <Link
              className={styles.pageBtn}
              href={buildUrl({ page: nextPage })}
            >
              Siguiente →
            </Link>
          ) : (
            <span className={styles.pageBtnDisabled}>Siguiente →</span>
          )}
        </div>
      )}
    </section>
  );
}
