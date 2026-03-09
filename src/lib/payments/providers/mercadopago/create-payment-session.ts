import prisma from "@/lib/prisma";
import { env } from "@/server/env";
import type { CreatePaymentSessionInput, CreatePaymentSessionResult } from "@/lib/payments/types";
import { PaymentProvider, PaymentStatus } from "@prisma/client";
import { createPreference } from "./client";

export async function createMercadoPagoPaymentSession(
  input: CreatePaymentSessionInput
): Promise<CreatePaymentSessionResult> {
  const order = await prisma.order.findUnique({
    where: { id: input.orderId },
    include: { items: true },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const successUrl = `${env.appUrl}/checkout?status=success&reference=${encodeURIComponent(
    order.reference
  )}`;
  const pendingUrl = `${env.appUrl}/checkout?status=pending&reference=${encodeURIComponent(
    order.reference
  )}`;
  const failureUrl = `${env.appUrl}/checkout?status=failure&reference=${encodeURIComponent(
    order.reference
  )}`;
  const notificationUrl = `${env.appUrl}/api/webhooks/mercadopago`;

  const payload = {
    external_reference: order.reference,
    notification_url: notificationUrl,
    back_urls: {
      success: successUrl,
      pending: pendingUrl,
      failure: failureUrl,
    },

    items: order.items.map((item) => ({
      id: item.productId ?? item.id,
      title: item.productName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      currency_id: order.currency,
      category_id: item.productCategory,
      description: item.productSlug,
    })),
    metadata: {
      orderId: order.id,
      paymentId: input.paymentId,
      reference: order.reference,
    },
  };

  const response = await createPreference(payload);

  return {
    provider: PaymentProvider.MERCADOPAGO,
    status: PaymentStatus.PENDING,
    providerStatus: "preference_created",
    externalReference: order.reference,
    checkoutSessionId: response.id,
    approvalUrl: response.init_point ?? response.sandbox_init_point ?? null,
    requestPayload: payload,
    responsePayload: response,
    expiresAt: response.date_of_expiration
      ? new Date(response.date_of_expiration)
      : null,
  };
}