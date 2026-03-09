import prisma from "@/lib/prisma";
import { createIdempotencyKey } from "@/lib/utils/idempotency";
import { getPaymentProviderAdapter } from "./registry";
import { PaymentProvider, PaymentStatus } from "@prisma/client";

export async function createPaymentSession(input: {
  orderId: string;
  provider: PaymentProvider;
}) {
  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
    include: {
      items: true,
      payments: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const existingPending = order.payments.find(
    (p) =>
      p.provider === input.provider &&
      [PaymentStatus.PENDING, PaymentStatus.REQUIRES_ACTION].includes(p.status)
  );

  const payment =
    existingPending ??
    (await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: input.provider,
        status: PaymentStatus.PENDING,
        currency: order.currency,
        amount: order.totalAmount,
        externalReference: order.reference,
        idempotencyKey: createIdempotencyKey(
          "checkout-session",
          `${input.provider}:${order.id}:${order.reference}`
        ),
      },
    }));

  const adapter = getPaymentProviderAdapter(input.provider);
  const session = await adapter.createPaymentSession({
    paymentId: payment.id,
    orderId: order.id,
  });

  const updated = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      method: session.method ?? null,
      status: session.status,
      providerStatus: session.providerStatus ?? null,
      externalPaymentId: session.externalPaymentId ?? null,
      externalOrderId: session.externalOrderId ?? null,
      externalReference: session.externalReference ?? order.reference,
      checkoutSessionId: session.checkoutSessionId ?? null,
      approvalUrl: session.approvalUrl ?? null,
      requestPayload: session.requestPayload as any,
      responsePayload: session.responsePayload as any,
      expiresAt: session.expiresAt ?? null,
    },
  });

  return updated;
}