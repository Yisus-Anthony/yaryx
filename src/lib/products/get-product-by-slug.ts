import prisma from "@/lib/prisma";

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug: slug.toLowerCase() },
  });
}