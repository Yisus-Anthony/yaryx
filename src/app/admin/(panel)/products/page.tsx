import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./styles.module.css";
import ProductsToolbar from "./_components/ProductsToolbar";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type ProductsPageProps = {
  searchParams?: {
    page?: string;
    q?: string;
    category?: string;
    sort?: string;
  };
};

function getSortOrder(sort?: string): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "name-asc":
      return [{ name: "asc" }];
    case "name-desc":
      return [{ name: "desc" }];
    case "price-asc":
      return [{ price: "asc" }];
    case "price-desc":
      return [{ price: "desc" }];
    case "updated-asc":
      return [{ updatedAt: "asc" }];
    case "updated-desc":
    default:
      return [{ updatedAt: "desc" }];
  }
}

function cldUrl(publicId?: string | null) {
  if (!publicId) return null;

  const cloud =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloud) return null;

  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_120,h_120,c_fill/${publicId}`;
}

export default async function AdminProductsPage({
  searchParams,
}: ProductsPageProps) {
  const requestedPage = Math.max(1, Number(searchParams?.page ?? "1") || 1);
  const query = searchParams?.q?.trim() ?? "";
  const category = searchParams?.category?.trim() ?? "";
  const sort = searchParams?.sort?.trim() ?? "updated-desc";

  const where: Prisma.ProductWhereInput = {
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { sku: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category ? { categoryId: category } : {}),
  };

  const [categories, totalItems] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  const items = await prisma.product.findMany({
    where,
    orderBy: getSortOrder(sort),
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      category: true,
      vehicleTypes: {
        include: {
          vehicleType: true,
        },
      },
    },
  });

  const buildPageHref = (page: number) => {
    const safePage = Math.max(1, Math.min(page, totalPages));
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    params.set("page", String(safePage));

    return `/admin/products?${params.toString()}`;
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, totalItems);

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>Catálogo</p>
          <h1 className={styles.title}>Productos</h1>
          <p className={styles.subtitle}>
            Administra tu inventario, precios y compatibilidades.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link href="/admin/products/new" className={styles.primaryButton}>
            Agregar producto
          </Link>
        </div>
      </div>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Lista de productos</h2>
            <p className={styles.cardDescription}>
              Mostrando {startItem}-{endItem} de {totalItems}{" "}
              {totalItems === 1 ? "producto" : "productos"}
            </p>
          </div>
        </div>

        <ProductsToolbar
          categories={categories}
          initialQuery={query}
          initialCategory={category}
          initialSort={sort}
        />

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Slug</th>
                <th>Categoría</th>
                <th>Condición</th>
                <th>Vehículos</th>
                <th className={styles.alignRight}>Precio</th>
                <th className={styles.alignRight}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {items.length ? (
                items.map((p) => {
                  const imageUrl = cldUrl(p.coverPublicId);

                  return (
                    <tr key={p.id}>
                      <td>
                        <div className={styles.productCell}>
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={p.name}
                              className={styles.productAvatarImage}
                            />
                          ) : (
                            <div className={styles.productAvatar}>
                              {p.name.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className={styles.productMeta}>
                            <span className={styles.productName}>{p.name}</span>
                            <span className={styles.productId}>ID: {p.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={styles.mono}>{p.sku ?? "—"}</span>
                      </td>

                      <td>
                        <span className={styles.mono}>{p.slug}</span>
                      </td>

                      <td>
                        <span className={styles.categoryBadge}>
                          {p.category.name}
                        </span>
                      </td>

                      <td>
                        <span className={styles.statusBadge}>
                          {p.condition}
                        </span>
                      </td>

                      <td>
                        {p.vehicleTypes.length ? (
                          <div className={styles.vehicleList}>
                            {p.vehicleTypes.slice(0, 2).map((item) => (
                              <span
                                key={`${p.id}-${item.vehicleType.name}`}
                                className={styles.vehicleBadge}
                              >
                                {item.vehicleType.name}
                              </span>
                            ))}

                            {p.vehicleTypes.length > 2 && (
                              <span className={styles.moreBadge}>
                                +{p.vehicleTypes.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className={styles.emptyText}>—</span>
                        )}
                      </td>

                      <td className={styles.alignRight}>
                        <span className={styles.price}>
                          ${p.price.toLocaleString("es-MX")}
                        </span>
                      </td>

                      <td className={styles.alignRight}>
                        <div className={styles.rowActions}>
                          <Link
                            href={`/admin/products/${p.id}`}
                            className={styles.secondaryButton}
                          >
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8}>
                    <div className={styles.emptyState}>
                      <h3>No hay resultados</h3>
                      <p>No encontramos productos con los filtros actuales.</p>
                      <Link
                        href="/admin/products"
                        className={styles.primaryButton}
                      >
                        Limpiar filtros
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalItems > 0 && (
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              Página {currentPage} de {totalPages}
            </div>

            <div className={styles.paginationActions}>
              {currentPage > 1 ? (
                <Link
                  href={buildPageHref(currentPage - 1)}
                  className={styles.secondaryButton}
                >
                  Anterior
                </Link>
              ) : (
                <span className={styles.disabledButton}>Anterior</span>
              )}

              {currentPage < totalPages ? (
                <Link
                  href={buildPageHref(currentPage + 1)}
                  className={styles.secondaryButton}
                >
                  Siguiente
                </Link>
              ) : (
                <span className={styles.disabledButton}>Siguiente</span>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
