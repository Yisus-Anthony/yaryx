import prisma from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function failOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      failedAt: true,
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

  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.FAILED,
      paymentStatus: PaymentStatus.FAILED,
      failedAt: order.failedAt ?? new Date(),
    },
  });
}