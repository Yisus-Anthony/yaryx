"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "../styles.module.css";

type CategoryOption = {
  id: string;
  name: string;
};

type ProductsToolbarProps = {
  categories: CategoryOption[];
  initialQuery: string;
  initialCategory: string;
  initialSort: string;
};

export default function ProductsToolbar({
  categories,
  initialQuery,
  initialCategory,
  initialSort,
}: ProductsToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialQuery);

  useEffect(() => {
    setSearch(initialQuery);
  }, [initialQuery]);

  const currentCategory = useMemo(
    () => searchParams.get("category") ?? initialCategory,
    [searchParams, initialCategory],
  );

  const currentSort = useMemo(
    () => searchParams.get("sort") ?? initialSort,
    [searchParams, initialSort],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set("q", search.trim());
      } else {
        params.delete("q");
      }

      params.delete("page");

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, pathname, router, searchParams]);

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleClear = () => {
    setSearch("");
    router.push(pathname);
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, SKU o slug..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.toolbarFilters}>
        <select
          value={currentCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className={styles.select}
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className={styles.select}
        >
          <option value="updated-desc">Más recientes</option>
          <option value="updated-asc">Más antiguos</option>
          <option value="name-asc">Nombre A-Z</option>
          <option value="name-desc">Nombre Z-A</option>
          <option value="price-asc">Precio menor a mayor</option>
          <option value="price-desc">Precio mayor a menor</option>
        </select>

        <button
          type="button"
          onClick={handleClear}
          className={styles.ghostButton}
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
