import prisma from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function confirmOrder(orderId: string, paymentStatus: PaymentStatus) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        cart: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (
      order.status === OrderStatus.PAID ||
      order.status === OrderStatus.PROCESSING ||
      order.status === OrderStatus.COMPLETED
    ) {
      return order;
    }

    for (const item of order.items) {
      if (!item.productId) continue;

      const result = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: { gte: item.quantity },
          isActive: true,
        },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      if (result.count === 0) {
        throw new Error(`No hay stock suficiente para ${item.productName}`);
      }
    }

    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.PAID,
        paymentStatus,
        paidAt: new Date(),
      },
      include: {
        items: true,
        payments: true,
        cart: true,
      },
    });

    if (order.cartId) {
      await tx.cart.update({
        where: { id: order.cartId },
        data: {
          status: "CONVERTED",
        },
      });
    }

    return updatedOrder;
  });
}