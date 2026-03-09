import prisma from "@/lib/prisma";
import { getOrCreateCartId } from "./get-or-create-cart";

export async function clearCart() {
  const cartId = await getOrCreateCartId();

  await prisma.cartItem.deleteMany({
    where: { cartId },
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