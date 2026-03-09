import { PaymentProvider } from "@prisma/client";
import type { PaymentProviderAdapter } from "@/lib/payments/types";
import { createMercadoPagoPaymentSession } from "./create-payment-session";
import { parseMercadoPagoWebhook } from "./parse-webhook";
import { verifyMercadoPagoWebhookSignature } from "./verify-webhook-signature";
import { processMercadoPagoWebhook } from "./process-webhook";

export const mercadoPagoProvider: PaymentProviderAdapter = {
  provider: PaymentProvider.MERCADOPAGO,
  createPaymentSession: createMercadoPagoPaymentSession,
  parseWebhook: parseMercadoPagoWebhook,
  verifyWebhookSignature: verifyMercadoPagoWebhookSignature,
  processWebhook: processMercadoPagoWebhook,
};