import Link from "next/link";
import { products } from "../../data/products";
import styles from "./products.module.css";

function cldUrl(publicId) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  // miniatura optimizada (w_500) + crop
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_500,c_fill/${publicId}`;
}

export default function ProductsPage() {
  return (
    <section className={styles.wrapper}>
      <h1 className={styles.title}>Productos</h1>

      <div className={styles.grid}>
        {products.map((p) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className={styles.card}
          >
            <img
              className={styles.thumb}
              src={cldUrl(p.coverPublicId)}
              alt={p.name}
            />
            <div className={styles.cardBody}>
              <h3 className={styles.name}>{p.name}</h3>
              <span className={styles.muted}>Ver más fotos →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
