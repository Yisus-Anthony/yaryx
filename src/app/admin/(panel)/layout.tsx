import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import styles from "./layout.module.css";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Ajusta esta validación según tu estrategia de roles
  const isAdmin = !!session?.user && session.user.role === "ADMIN";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Admin</div>

        <nav className={styles.nav} aria-label="Admin navigation">
          <Link href="/admin/products" className={styles.link}>
            Productos
          </Link>
        </nav>
      </aside>

      <section className={styles.content}>
        <header className={styles.topbar}>
          <h1 className={styles.title}>Panel de administración</h1>
        </header>

        <main className={styles.main}>{children}</main>
      </section>
    </div>
  );
}
