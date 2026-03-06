import Link from "next/link";
import styles from "./product.module.css";
import ProductGallery from "./ProductGallery";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default async function ProductDetail({ params }) {
  const slug = (params.slug || "").toLowerCase();

  const base =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const res = await fetch(`${base}/api/products/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return <div>Producto no encontrado</div>;

  const data = await res.json();
  const product = data.product;

  return (
    <section className={styles.wrapper}>
      <Link href="/products" className={styles.backButton}>
        ← Volver a productos
      </Link>

      <h1 className={styles.title}>{product.name}</h1>
      <p className={styles.subtitle}>Galería de fotos</p>

      <ProductGallery slug={slug} />

      {/* ✅ Botón real */}
      <AddToCartButton productId={product.id} />
    </section>
  );
}
