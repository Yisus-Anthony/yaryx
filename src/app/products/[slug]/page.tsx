import Link from "next/link";
import styles from "./product.module.css";
import ProductGallery from "./product/ProductGallery";
import AddToCartButton from "@/components/cart/AddToCartButton";

type PageProps = {
  params: {
    slug: string;
  };
};

type Product = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
};

type ProductResponse = {
  product: Product | null;
};

export default async function ProductDetail({ params }: PageProps) {
  const slug = params.slug.toLowerCase();

  const base =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const res = await fetch(`${base}/api/products/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Producto no encontrado</div>;
  }

  const data: ProductResponse = await res.json();

  if (!data.product) {
    return <div>Producto no encontrado</div>;
  }

  const product = data.product;

  return (
    <section className={styles.wrapper}>
      <Link href="/products" className={styles.backButton}>
        ← Volver a productos
      </Link>

      <h1 className={styles.title}>{product.name}</h1>

      {product.sku ? (
        <p className={styles.subtitle}>SKU: {product.sku}</p>
      ) : null}

      <p
        style={{
          fontSize: "22px",
          fontWeight: 700,
          margin: "8px 0 16px",
        }}
      >
        ${Number(product.price).toLocaleString("es-MX")}
      </p>

      <p className={styles.subtitle}>Galería de fotos</p>

      <ProductGallery slug={slug} />
      <AddToCartButton productId={product.id} />
    </section>
  );
}
