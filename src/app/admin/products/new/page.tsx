import Link from "next/link";
import { redirect } from "next/navigation";
import  prisma  from "@/lib/prisma";
import ProductForm from "../_components/ProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  async function onSave(formData: any) {
    "use server";
    try {
      const created = await prisma.product.create({
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
      redirect(`/admin/products/${created.id}`);
    } catch (e: any) {
      return { ok: false, error: e?.message || "Error" };
    }
  }

  return (
    <main style={{ maxWidth: 1000, margin: "40px auto", padding: 16 }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <h1>Nuevo producto</h1>
        <Link href="/admin/products">← Volver</Link>
      </div>

      <ProductForm
        initial={{
          slug: "",
          name: "",
          category: "",
          condition: "nuevo",
          price: 0,
          folder: "",
          coverPublicId: "",
        }}
        onSave={onSave as any}
      />
    </main>
  );
}
