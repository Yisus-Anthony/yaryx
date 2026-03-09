import prisma from "@/lib/prisma";
import { getOrCreateCartId } from "./get-or-create-cart";

export async function removeItem(productId: string) {
  const cartId = await getOrCreateCartId();

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId, productId } },
  });

  if (!existing) {
    throw new Error("El producto no está en el carrito");
  }

  await prisma.cartItem.delete({
    where: { cartId_productId: { cartId, productId } },
  });

  return prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}