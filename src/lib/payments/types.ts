import type { PaymentProvider, PaymentMethod, PaymentStatus } from "@prisma/client";

export type CreatePaymentSessionInput = {
  paymentId: string;
  orderId: string;
};

export type CreatePaymentSessionResult = {
  provider: PaymentProvider;
  method?: PaymentMethod | null;
  status: PaymentStatus;
  providerStatus?: string | null;
  externalPaymentId?: string | null;
  externalOrderId?: string | null;
  externalReference?: string | null;
  checkoutSessionId?: string | null;
  approvalUrl?: string | null;
  requestPayload?: unknown;
  responsePayload?: unknown;
  expiresAt?: Date | null;
};

export type ParsedWebhook = {
  externalEventId: string | null;
  eventType: string;
  resourceType: string | null;
  resourceId: string | null;
  signature: string | null;
  headers: Record<string, string>;
  payload: unknown;
  query: Record<string, string>;
};

export type ProcessWebhookResult = {
  ignored?: boolean;
  orderId?: string | null;
  paymentId?: string | null;
  externalEventId?: string | null;
  eventType: string;
  paymentStatus?: PaymentStatus;
};

export interface PaymentProviderAdapter {
  provider: PaymentProvider;
  createPaymentSession(input: CreatePaymentSessionInput): Promise<CreatePaymentSessionResult>;
  parseWebhook(request: Request, rawBody: string): Promise<ParsedWebhook>;
  verifyWebhookSignature(input: {
    request: Request;
    rawBody: string;
    parsed: ParsedWebhook;
  }): Promise<boolean>;
  processWebhook(input: {
    parsed: ParsedWebhook;
    rawBody: string;
    signatureValid: boolean;
  }): Promise<ProcessWebhookResult>;
}