import Link from "next/link";
import styles from "./CategoryMenu.module.css";

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

type Props = {
  categoryTree: CategoryNode[];
  activeCategory: string;
  condition: string;
  vehicleType: string;
  buildUrl: (next: BuildUrlParams) => string;
};

function containsSlug(node: CategoryNode, slug: string): boolean {
  if (node.slug === slug) return true;
  return node.children.some((child) => containsSlug(child, slug));
}

export default function CategoryMenu({
  categoryTree,
  activeCategory,
  condition,
  vehicleType,
  buildUrl,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <Link
        href={buildUrl({
          page: 1,
          condition,
          vehicleType,
          category: "all",
        })}
        className={`${styles.allButton} ${
          activeCategory === "all" ? styles.active : ""
        }`}
      >
        Todo
      </Link>

      <div className={styles.parentList}>
        {categoryTree.map((parent) => {
          const isActive = containsSlug(parent, activeCategory);

          return (
            <div key={parent.id} className={styles.parentItem}>
              <Link
                href={buildUrl({
                  page: 1,
                  condition,
                  vehicleType,
                  category: parent.slug,
                })}
                className={`${styles.parentButton} ${
                  isActive ? styles.active : ""
                }`}
              >
                {parent.name}
              </Link>

              {parent.children.length > 0 && (
                <>
                  <div className={styles.desktopDropdown}>
                    <div className={styles.dropdownCard}>
                      {parent.children.map((child) => (
                        <div key={child.id} className={styles.group}>
                          <Link
                            href={buildUrl({
                              page: 1,
                              condition,
                              vehicleType,
                              category: child.slug,
                            })}
                            className={`${styles.childLink} ${
                              activeCategory === child.slug
                                ? styles.activeText
                                : ""
                            }`}
                          >
                            {child.name}
                          </Link>

                          {child.children.length > 0 && (
                            <div className={styles.subList}>
                              {child.children.map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={buildUrl({
                                    page: 1,
                                    condition,
                                    vehicleType,
                                    category: sub.slug,
                                  })}
                                  className={`${styles.subChip} ${
                                    activeCategory === sub.slug
                                      ? styles.active
                                      : ""
                                  }`}
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <details className={styles.mobileDropdown}>
                    <summary className={styles.mobileSummary}>
                      Ver subcategorías
                    </summary>

                    <div className={styles.mobilePanel}>
                      {parent.children.map((child) => (
                        <div key={child.id} className={styles.group}>
                          <Link
                            href={buildUrl({
                              page: 1,
                              condition,
                              vehicleType,
                              category: child.slug,
                            })}
                            className={`${styles.childLink} ${
                              activeCategory === child.slug
                                ? styles.activeText
                                : ""
                            }`}
                          >
                            {child.name}
                          </Link>

                          {child.children.length > 0 && (
                            <div className={styles.subList}>
                              {child.children.map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={buildUrl({
                                    page: 1,
                                    condition,
                                    vehicleType,
                                    category: sub.slug,
                                  })}
                                  className={`${styles.subChip} ${
                                    activeCategory === sub.slug
                                      ? styles.active
                                      : ""
                                  }`}
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
