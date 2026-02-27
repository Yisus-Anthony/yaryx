import styles from "./product.module.css";
import { products } from "../../../data/products";
import ProductGallery from "./ProductGallery";

export default async function ProductDetail({ params }) {
  const { slug } = await params;

  const product = products.find((p) => p.slug === slug);

  if (!product) return <div>Producto no encontrado</div>;

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.title}>{product.name}</h1>
      <p className={styles.subtitle}>Galería de fotos</p>

      {/* ✅ La parte interactiva va en un Client Component */}
      <ProductGallery slug={slug} />
    </section>
  );
}
