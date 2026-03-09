import prisma from "@/lib/prisma";
import { getOrCreateCartId } from "./get-or-create-cart";
import { validateProductPurchasable } from "@/lib/products/validate-product-purchasable";

export async function addItem(productId: string, quantity = 1) {
  if (!productId) {
    throw new Error("productId requerido");
  }

  const qty = Math.max(1, Number(quantity || 1));
  const cartId = await getOrCreateCartId();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  validateProductPurchasable(product);

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId, productId } },
  });

  const nextQty = existing ? existing.quantity + qty : qty;

  if (nextQty > product.stock) {
    throw new Error("Sin stock suficiente");
  }

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId, productId } },
    create: {
      cartId,
      productId,
      quantity: qty,
      unitPrice: product.price,
    },
    update: {
      quantity: nextQty,
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