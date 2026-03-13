import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductForm from "../_components/ProductForm";
import { ProductCondition } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const vehicleTypes = await prisma.vehicleType.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  async function onSave(formData: {
    sku: string;
    slug: string;
    name: string;
    description: string;
    folder: string;
    coverPublicId: string;
    condition: string;
    categoryId: string;
    price: number;
    stock: number;
    isActive: boolean;
    vehicleTypeIds: string[];
  }) {
    "use server";

    try {
      const created = await prisma.product.create({
        data: {
          sku: formData.sku ? String(formData.sku) : null,
          slug: String(formData.slug),
          name: String(formData.name),
          description: formData.description
            ? String(formData.description)
            : null,
          categoryId: String(formData.categoryId),
          condition: String(formData.condition) as ProductCondition,
          price: Number(formData.price),
          stock: Number(formData.stock),
          isActive: Boolean(formData.isActive),
          folder: String(formData.folder),
          coverPublicId: String(formData.coverPublicId),
          vehicleTypes: {
            create: (formData.vehicleTypeIds ?? []).map((vehicleTypeId) => ({
              vehicleTypeId,
            })),
          },
        },
      });

      redirect(`/admin/products/${created.id}`);
    } catch (e: any) {
      return { ok: false, error: e?.message || "Error al crear producto" };
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
          sku: "",
          slug: "",
          name: "",
          description: "",
          folder: "",
          coverPublicId: "",
          condition: "NEW",
          categoryId: "",
          price: 0,
          stock: 0,
          isActive: true,
          vehicleTypeIds: [],
        }}
        categories={categories}
        vehicleTypes={vehicleTypes}
        onSave={onSave}
      />
    </main>
  );
}
