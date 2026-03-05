import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "../_components/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return notFound();

  async function onSave(formData: any) {
    "use server";
    try {
      await prisma.product.update({
        where: { id: params.id },
        data: {
          slug: String(formData.slug),
          name: String(formData.name),
          category: String(formData.category),
          condition: String(formData.condition),
          price: Number(formData.price),
          folder: String(formData.folder),
          coverPublicId: String(formData.coverPublicId),
        },
      });
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message || "Error" };
    }
  }

  async function onDelete() {
    "use server";
    try {
      await prisma.product.delete({ where: { id: params.id } });
      redirect("/admin/products");
    } catch (e: any) {
      return { ok: false, error: e?.message || "Error" };
    }
  }

  return (
    <main style={{ maxWidth: 1000, margin: "40px auto", padding: 16 }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <h1>Editar producto</h1>
        <Link href="/admin/products">← Volver</Link>
      </div>

      <ProductForm
        initial={product as any}
        onSave={onSave as any}
        onDelete={onDelete as any}
      />
    </main>
  );
}
