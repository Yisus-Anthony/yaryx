import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductForm from "../_components/ProductForm";
import { ProductCondition } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      vehicleTypes: true,
    },
  });

  if (!product) return notFound();

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
      await prisma.product.update({
        where: { id },
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
            deleteMany: {},
            create: (formData.vehicleTypeIds ?? []).map((vehicleTypeId) => ({
              vehicleTypeId,
            })),
          },
        },
      });

      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message || "Error al actualizar producto" };
    }
  }

  async function onDelete() {
    "use server";

    try {
      await prisma.product.delete({
        where: { id },
      });

      redirect("/admin/products");
    } catch (e: any) {
      return { ok: false, error: e?.message || "Error al borrar producto" };
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
        initial={{
          id: product.id,
          sku: product.sku ?? "",
          slug: product.slug,
          name: product.name,
          description: product.description ?? "",
          folder: product.folder,
          coverPublicId: product.coverPublicId,
          condition: product.condition,
          categoryId: product.categoryId,
          price: product.price,
          stock: product.stock,
          isActive: product.isActive,
          vehicleTypeIds: product.vehicleTypes.map(
            (item) => item.vehicleTypeId,
          ),
        }}
        categories={categories}
        vehicleTypes={vehicleTypes}
        onSave={onSave}
        onDelete={onDelete}
      />
    </main>
  );
}
