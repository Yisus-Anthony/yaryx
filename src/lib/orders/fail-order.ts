import prisma from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function failOrder(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.FAILED,
      paymentStatus: PaymentStatus.FAILED,
      failedAt: new Date(),
    },
  });
}