import prisma from "@/lib/prisma";
import { getOrCreateCartId } from "./get-or-create-cart";

export async function getCart() {
  const cartId = await getOrCreateCartId();

  return prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}