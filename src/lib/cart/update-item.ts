import prisma from "@/lib/prisma";
import { getOrCreateCartId } from "./get-or-create-cart";
import { validateProductPurchasable } from "@/lib/products/validate-product-purchasable";

export async function updateItem(productId: string, quantity: number) {
  const qty = Number(quantity);

  if (!Number.isFinite(qty) || qty < 1) {
    throw new Error("quantity inválida");
  }

  const cartId = await getOrCreateCartId();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  validateProductPurchasable(product);

  if (qty > product.stock) {
    throw new Error("Sin stock suficiente");
  }

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId, productId } },
  });

  if (!existing) {
    throw new Error("El producto no está en el carrito");
  }

  await prisma.cartItem.update({
    where: { cartId_productId: { cartId, productId } },
    data: {
      quantity: qty,
      unitPrice: product.price,
    },
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