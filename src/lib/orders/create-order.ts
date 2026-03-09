import prisma from "@/lib/prisma";
import { calculateCartTotals } from "@/lib/cart/calculate-totals";
import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";

type CartForOrder = NonNullable<
  Awaited<ReturnType<typeof import("@/lib/cart/get-cart").getCart>>
>;

function generateOrderNumber() {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ORD-${ymd}-${rand}`;
}

function generateReference() {
  return `ref_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function createOrder(input: {
  cart: CartForOrder;
  currency?: string;
}) {
  const { cart } = input;

  if (!cart.items.length) {
    throw new Error("El carrito está vacío");
  }

  const totals = calculateCartTotals(cart);

  const data: Prisma.OrderCreateInput = {
    orderNumber: generateOrderNumber(),
    reference: generateReference(),
    status: OrderStatus.AWAITING_PAYMENT,
    paymentStatus: PaymentStatus.PENDING,
    currency: input.currency ?? "MXN",
    subtotal: totals.subtotal,
    taxAmount: totals.taxAmount,
    shippingAmount: totals.shippingAmount,
    discountAmount: totals.discountAmount,
    totalAmount: totals.totalAmount,
    totalItems: totals.totalItems,
    cart: {
      connect: { id: cart.id },
    },
    items: {
      create: cart.items.map((item) => ({
        product: item.productId ? { connect: { id: item.productId } } : undefined,
        productSlug: item.product.slug,
        productName: item.product.name,
        productFolder: item.product.folder,
        productCoverPublicId: item.product.coverPublicId,
        productCondition: item.product.condition,
        productCategory: item.product.category,
        unitPrice: Number(item.product.price),
        quantity: item.quantity,
        lineTotal: Number(item.product.price) * item.quantity,
      })),
    },
  };

  return prisma.order.create({
    data,
    include: {
      items: true,
      cart: true,
    },
  });
}