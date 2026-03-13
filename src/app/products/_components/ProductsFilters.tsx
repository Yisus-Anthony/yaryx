import Link from "next/link";
import styles from "./ProductsFilters.module.css";
import CategoryMenu from "./CategoryMenu";

type ConditionOption = {
  label: string;
  value: string;
};

type VehicleTypeOption = {
  id: string;
  name: string;
  slug: string;
};

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children: CategoryNode[];
};

type BuildUrlParams = {
  page?: number;
  condition?: string;
  category?: string;
  vehicleType?: string;
};

type ProductsFiltersProps = {
  condition: string;
  category: string;
  vehicleType: string;
  total: number;
  conditionOptions: ConditionOption[];
  vehicleTypeOptions: VehicleTypeOption[];
  categoryTree: CategoryNode[];
  buildUrl: (next: BuildUrlParams) => string;
};

function findCategoryName(nodes: CategoryNode[], slug: string): string | null {
  for (const node of nodes) {
    if (node.slug === slug) return node.name;

    const found = findCategoryName(node.children, slug);
    if (found) return found;
  }

  return null;
}

function activeFiltersCount(params: {
  condition: string;
  vehicleType: string;
  category: string;
}) {
  let count = 0;
  if (params.condition !== "all") count += 1;
  if (params.vehicleType !== "all") count += 1;
  if (params.category !== "all") count += 1;
  return count;
}

export default function ProductsFilters({
  condition,
  category,
  vehicleType,
  total,
  conditionOptions,
  vehicleTypeOptions,
  categoryTree,
  buildUrl,
}: ProductsFiltersProps) {
  const selectedCondition =
    conditionOptions.find((item) => item.value === condition)?.label ?? "";

  const selectedVehicleType =
    vehicleTypeOptions.find((item) => item.slug === vehicleType)?.name ?? "";

  const selectedCategory = findCategoryName(categoryTree, category) ?? "";

  const filtersCount = activeFiltersCount({
    condition,
    vehicleType,
    category,
  });

  return (
    <details className={styles.filtersDrawer}>
      <summary className={styles.filtersBtn}>
        <div className={styles.filtersBtnLeft}>
          <span className={styles.filtersIcon}>☰</span>
          <span>Filtros</span>
          {filtersCount > 0 && (
            <span className={styles.filtersBadge}>{filtersCount}</span>
          )}
        </div>

        <div className={styles.filtersState}>
          {condition !== "all" && (
            <span className={styles.activeToken}>{selectedCondition}</span>
          )}
          {vehicleType !== "all" && (
            <span className={styles.activeToken}>{selectedVehicleType}</span>
          )}
          {category !== "all" && (
            <span className={styles.activeToken}>{selectedCategory}</span>
          )}
        </div>
      </summary>

      <div className={styles.filtersPanel}>
        <div className={styles.filterSection}>
          <div className={styles.filterHeader}>
            <h3 className={styles.filterTitle}>Condición</h3>
          </div>

          <div className={styles.pillsWrap}>
            <Link
              className={`${styles.filterChip} ${
                condition === "all" ? styles.filterChipActive : ""
              }`}
              href={buildUrl({ page: 1, condition: "all", vehicleType, category })}
            >
              Todo
            </Link>

            {conditionOptions.map((item) => (
              <Link
                key={item.value}
                className={`${styles.filterChip} ${
                  condition === item.value ? styles.filterChipActive : ""
                }`}
                href={buildUrl({
                  page: 1,
                  condition: item.value,
                  vehicleType,
                  category,
                })}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.filterSection}>
          <div className={styles.filterHeader}>
            <h3 className={styles.filterTitle}>Tipo de vehículo</h3>
          </div>

          <div className={styles.pillsWrap}>
            <Link
              className={`${styles.filterChip} ${
                vehicleType === "all" ? styles.filterChipActive : ""
              }`}
              href={buildUrl({ page: 1, condition, vehicleType: "all", category })}
            >
              Todo
            </Link>

            {vehicleTypeOptions.length > 0 ? (
              vehicleTypeOptions.map((item) => (
                <Link
                  key={item.id}
                  className={`${styles.filterChip} ${
                    vehicleType === item.slug ? styles.filterChipActive : ""
                  }`}
                  href={buildUrl({
                    page: 1,
                    condition,
                    vehicleType: item.slug,
                    category,
                  })}
                >
                  {item.name}
                </Link>
              ))
            ) : (
              <span className={styles.emptyInline}>
                No hay tipos de vehículo asociados a productos.
              </span>
            )}
          </div>
        </div>

        <div className={styles.filterSection}>
          <div className={styles.filterHeader}>
            <h3 className={styles.filterTitle}>Categorías</h3>
          </div>

          <CategoryMenu
            categoryTree={categoryTree}
            activeCategory={category}
            condition={condition}
            vehicleType={vehicleType}
            buildUrl={buildUrl}
          />
        </div>

        <div className={styles.footerBar}>
          <div className={styles.resultsInfo}>
            Mostrando <strong>{total}</strong> producto(s)
          </div>

          <Link className={styles.clearBtn} href="/products">
            Limpiar filtros
          </Link>
        </div>
      </div>
    </details>
  );
}