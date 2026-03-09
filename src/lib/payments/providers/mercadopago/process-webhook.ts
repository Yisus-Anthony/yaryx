import prisma from "@/lib/prisma";
import type { ParsedWebhook, ProcessWebhookResult } from "@/lib/payments/types";
import { PaymentStatus } from "@prisma/client";
import { getPaymentById } from "./client";
import {
  mapMercadoPagoMethod,
  mapMercadoPagoStatus,
} from "./map-payment-status";
import { confirmOrder } from "@/lib/orders/confirm-order";
import { failOrder } from "@/lib/orders/fail-order";
import { cancelOrder } from "@/lib/orders/cancel-order";

export async function processMercadoPagoWebhook(input: {
  parsed: ParsedWebhook;
  rawBody: string;
  signatureValid: boolean;
}): Promise<ProcessWebhookResult> {
  const paymentId = input.parsed.resourceId;

  if (!paymentId) {
    return {
      ignored: true,
      eventType: input.parsed.eventType,
      externalEventId: input.parsed.externalEventId,
    };
  }

  const paymentData = await getPaymentById(paymentId);

  const externalReference = paymentData.external_reference;
  if (!externalReference) {
    return {
      ignored: true,
      eventType: input.parsed.eventType,
      externalEventId: input.parsed.externalEventId,
    };
  }

  const order = await prisma.order.findUnique({
    where: { reference: externalReference },
    include: { payments: true },
  });

  if (!order) {
    throw new Error(`Order not found for reference ${externalReference}`);
  }

  const internalStatus = mapMercadoPagoStatus(paymentData.status);
  const internalMethod = mapMercadoPagoMethod(paymentData.payment_type_id);

  let payment = order.payments.find(
    (p) =>
      p.externalPaymentId === String(paymentData.id) ||
      p.checkoutSessionId === input.parsed.query["preference_id"] ||
      p.externalReference === externalReference
  );

  if (!payment) {
    payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "MERCADOPAGO",
        status: internalStatus,
        method: internalMethod,
        currency: order.currency,
        amount: order.totalAmount,
        externalPaymentId: String(paymentData.id),
        externalOrderId: paymentData.order?.id ? String(paymentData.order.id) : null,
        externalReference,
        providerStatus: paymentData.status ?? null,
        approvedAt: paymentData.date_approved ? new Date(paymentData.date_approved) : null,
        responsePayload: paymentData as any,
      },
    });
  } else {
    payment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: internalStatus,
        method: internalMethod,
        providerStatus: paymentData.status ?? null,
        externalPaymentId: String(paymentData.id),
        externalOrderId: paymentData.order?.id ? String(paymentData.order.id) : null,
        externalReference,
        approvedAt: paymentData.date_approved ? new Date(paymentData.date_approved) : null,
        failedAt: internalStatus === PaymentStatus.FAILED ? new Date() : null,
        cancelledAt: internalStatus === PaymentStatus.CANCELLED ? new Date() : null,
        refundedAt: internalStatus === PaymentStatus.REFUNDED ? new Date() : null,
        responsePayload: paymentData as any,
      },
    });
  }

  if (
    internalStatus === PaymentStatus.APPROVED ||
    internalStatus === PaymentStatus.CAPTURED ||
    internalStatus === PaymentStatus.AUTHORIZED
  ) {
    await confirmOrder(order.id, internalStatus);
  } else if (internalStatus === PaymentStatus.FAILED) {
    await failOrder(order.id);
  } else if (
    internalStatus === PaymentStatus.CANCELLED ||
    internalStatus === PaymentStatus.EXPIRED
  ) {
    await cancelOrder(order.id, internalStatus);
  }

  return {
    ignored: false,
    orderId: order.id,
    paymentId: payment.id,
    paymentStatus: internalStatus,
    eventType: input.parsed.eventType,
    externalEventId: input.parsed.externalEventId,
  };
}