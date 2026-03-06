import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const slug = (params.slug || "").toLowerCase();
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) {
    return NextResponse.json({ error: "No existe" }, { status: 404 });
  }

  return NextResponse.json({ product });
}