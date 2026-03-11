import prisma from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function confirmOrder(
  orderId: string,
  paymentStatus: PaymentStatus = PaymentStatus.APPROVED
) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
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

      const product = await tx.product.findUnique({
        where: { id: item.productId },
        select: { id: true, stock: true, name: true },
      });

      if (!product) {
        throw new Error(`Product not found for order item ${item.id}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for product ${product.name}. Required ${item.quantity}, available ${product.stock}`
        );
      }

      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PAID,
        paymentStatus,
        paidAt: order.paidAt ?? new Date(),
      },
    });

    return updatedOrder;
  });
}