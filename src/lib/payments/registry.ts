import { PaymentProvider } from "@prisma/client";
import type { PaymentProviderAdapter } from "./types";
import { mercadoPagoProvider } from "./providers/mercadopago";

const registry: Record<PaymentProvider, PaymentProviderAdapter> = {
  [PaymentProvider.MERCADOPAGO]: mercadoPagoProvider,

  [PaymentProvider.PAYPAL]: {
    provider: PaymentProvider.PAYPAL,
    async createPaymentSession() {
      throw new Error("PayPal no está implementado todavía");
    },
    async parseWebhook() {
      throw new Error("PayPal no está implementado todavía");
    },
    async verifyWebhookSignature() {
      throw new Error("PayPal no está implementado todavía");
    },
    async processWebhook() {
      throw new Error("PayPal no está implementado todavía");
    },
  },

  [PaymentProvider.CODI]: {
    provider: PaymentProvider.CODI,
    async createPaymentSession() {
      throw new Error("CoDi no está implementado todavía");
    },
    async parseWebhook() {
      throw new Error("CoDi no está implementado todavía");
    },
    async verifyWebhookSignature() {
      throw new Error("CoDi no está implementado todavía");
    },
    async processWebhook() {
      throw new Error("CoDi no está implementado todavía");
    },
  },

  [PaymentProvider.MANUAL_TRANSFER]: {
    provider: PaymentProvider.MANUAL_TRANSFER,
    async createPaymentSession() {
      throw new Error("Transferencia manual no está implementada todavía");
    },
    async parseWebhook() {
      throw new Error("Transferencia manual no soporta webhooks");
    },
    async verifyWebhookSignature() {
      throw new Error("Transferencia manual no soporta webhooks");
    },
    async processWebhook() {
      throw new Error("Transferencia manual no soporta webhooks");
    },
  },
};

export function getPaymentProviderAdapter(provider: PaymentProvider) {
  return registry[provider];
}