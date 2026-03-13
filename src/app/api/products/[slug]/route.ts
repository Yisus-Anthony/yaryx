import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const slug = (params.slug || "").toLowerCase();

  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      id: true,
      sku: true,
      slug: true,
      name: true,
      description: true,
      price: true,
      coverPublicId: true,
      folder: true,
      condition: true,
      stock: true,
      isActive: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "No existe" }, { status: 404 });
  }

  return NextResponse.json({ product });
}