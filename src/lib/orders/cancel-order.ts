import prisma from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function cancelOrder(
    orderId: string,
    paymentStatus?: PaymentStatus
) {
    return prisma.order.update({
        where: { id: orderId },
        data: {
            status: OrderStatus.CANCELLED,
            paymentStatus: paymentStatus ?? PaymentStatus.CANCELLED,
            cancelledAt: new Date(),
        },
    });
}