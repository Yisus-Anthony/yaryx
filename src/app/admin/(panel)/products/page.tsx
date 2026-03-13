import Link from "next/link";
import prisma from "@/lib/prisma";
import styles from "./styles.module.css";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const currentPage = Math.max(1, Number(searchParams?.page ?? "1") || 1);

  const totalItems = await prisma.product.count();

  const items = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
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

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

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
              {totalItems} {totalItems === 1 ? "producto" : "productos"}{" "}
              registrados
            </p>
          </div>
        </div>

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
                items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.productCell}>
                        <div className={styles.productAvatar}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>

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
                      <span className={styles.statusBadge}>{p.condition}</span>
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
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <div className={styles.emptyState}>
                      <h3>No hay productos</h3>
                      <p>Todavía no has agregado productos al catálogo.</p>
                      <Link
                        href="/admin/products/new"
                        className={styles.primaryButton}
                      >
                        Crear primer producto
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
              <Link
                href={
                  currentPage > 1
                    ? `/admin/products?page=${currentPage - 1}`
                    : "#"
                }
                className={
                  currentPage > 1
                    ? styles.secondaryButton
                    : styles.disabledButton
                }
                aria-disabled={currentPage <= 1}
              >
                Anterior
              </Link>

              <Link
                href={
                  currentPage < totalPages
                    ? `/admin/products?page=${currentPage + 1}`
                    : "#"
                }
                className={
                  currentPage < totalPages
                    ? styles.secondaryButton
                    : styles.disabledButton
                }
                aria-disabled={currentPage >= totalPages}
              >
                Siguiente
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
