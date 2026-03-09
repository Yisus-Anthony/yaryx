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
};

export function getPaymentProviderAdapter(provider: PaymentProvider) {
  return registry[provider];
}