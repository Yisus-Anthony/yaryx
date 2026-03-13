import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const items = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      category: true,
      vehicleTypes: {
        include: {
          vehicleType: true,
        },
      },
    },
  });

  return (
    <main style={{ maxWidth: 1100, margin: "40px auto", padding: 16 }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <h1>Admin · Productos</h1>
        <Link href="/admin/products/new">+ Nuevo</Link>
      </div>

      <div
        style={{
          marginTop: 16,
          border: "1px solid #ddd",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f6f6f6" }}>
              <th style={{ textAlign: "left", padding: 10 }}>SKU</th>
              <th style={{ textAlign: "left", padding: 10 }}>Nombre</th>
              <th style={{ textAlign: "left", padding: 10 }}>Slug</th>
              <th style={{ textAlign: "left", padding: 10 }}>Categoría</th>
              <th style={{ textAlign: "left", padding: 10 }}>Condición</th>
              <th style={{ textAlign: "left", padding: 10 }}>Vehículos</th>
              <th style={{ textAlign: "right", padding: 10 }}>Precio</th>
              <th style={{ padding: 10 }} />
            </tr>
          </thead>

          <tbody>
            {items.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: 10 }}>{p.sku ?? "—"}</td>
                <td style={{ padding: 10 }}>{p.name}</td>
                <td style={{ padding: 10 }}>{p.slug}</td>
                <td style={{ padding: 10 }}>{p.category.name}</td>
                <td style={{ padding: 10 }}>{p.condition}</td>
                <td style={{ padding: 10 }}>
                  {p.vehicleTypes.length
                    ? p.vehicleTypes
                        .map((item) => item.vehicleType.name)
                        .join(", ")
                    : "—"}
                </td>
                <td style={{ padding: 10, textAlign: "right" }}>
                  ${p.price.toLocaleString("es-MX")}
                </td>
                <td style={{ padding: 10, textAlign: "right" }}>
                  <Link href={`/admin/products/${p.id}`}>Editar</Link>
                </td>
              </tr>
            ))}

            {!items.length ? (
              <tr>
                <td colSpan={8} style={{ padding: 12 }}>
                  No hay productos.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
