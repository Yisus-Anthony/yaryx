import Link from "next/link";
import styles from "./products.module.css";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductsFilters from "./_components/ProductsFilters";
import { getProductFiltersMeta, getProducts } from "@/lib/services/products";

type SearchParams = {
  page?: string;
  condition?: string;
  category?: string;
  vehicleType?: string;
};

type ProductsPageProps = {
  searchParams?: {
    page?: string;
    condition?: string;
    category?: string;
    vehicleType?: string;
  };
};

type BuildUrlParams = {
  page?: number;
  condition?: string;
  category?: string;
  vehicleType?: string;
};

function cldUrl(publicId: string): string {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_500,c_fill/${publicId}`;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = searchParams ?? {};

  const pageParam = Number(params.page ?? "1");
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const condition = (params.condition ?? "all").toLowerCase();
  const category = (params.category ?? "all").toLowerCase();
  const vehicleType = (params.vehicleType ?? "all").toLowerCase();

  const [data, filtersMeta] = await Promise.all([
    getProducts({ page, condition, category, vehicleType }),
    getProductFiltersMeta(),
  ]);

  const visible = data.items;
  const total = data.total;
  const totalPages = data.totalPages;
  const currentPage = data.page;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  function buildUrl(next: BuildUrlParams): string {
    const urlParams = new URLSearchParams();

    if (next.page && next.page > 1) {
      urlParams.set("page", String(next.page));
    }

    if (next.condition && next.condition !== "all") {
      urlParams.set("condition", next.condition);
    }

    if (next.vehicleType && next.vehicleType !== "all") {
      urlParams.set("vehicleType", next.vehicleType);
    }

    if (next.category && next.category !== "all") {
      urlParams.set("category", next.category);
    }

    const qs = urlParams.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  return (
    <section className={styles.wrapper}>
      <Link href="/" className={styles.backButton}>
        ← Atrás
      </Link>

      <h1 className={styles.title}>Productos</h1>

      <ProductsFilters
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
          Si el producto no aparece en catálogo, pregunte por WhatsApp.
        </div>
      )}

      <div className={styles.pagination}>
        {prevPage ? (
          <Link
            className={styles.pageBtn}
            href={buildUrl({
              page: prevPage,
              condition,
              category,
              vehicleType,
            })}
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
            href={buildUrl({
              page: nextPage,
              condition,
              category,
              vehicleType,
            })}
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
