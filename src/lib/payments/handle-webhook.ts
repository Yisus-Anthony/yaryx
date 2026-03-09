import prisma from "@/lib/prisma";
import { PaymentProvider, WebhookProcessingStatus } from "@prisma/client";
import { getPaymentProviderAdapter } from "./registry";
import { logger } from "@/lib/utils/logger";

export async function handleWebhook(provider: PaymentProvider, request: Request) {
  const rawBody = await request.text();
  const adapter = getPaymentProviderAdapter(provider);

  const parsed = await adapter.parseWebhook(request, rawBody);

  const existing =
    parsed.externalEventId
      ? await prisma.paymentWebhookEvent.findUnique({
          where: {
            provider_externalEventId: {
              provider,
              externalEventId: parsed.externalEventId,
            },
          },
        })
      : null;

  if (existing) {
    return { ok: true, duplicated: true };
  }

  const signatureValid = await adapter.verifyWebhookSignature({
    request,
    rawBody,
    parsed,
  });

  const webhookEvent = await prisma.paymentWebhookEvent.create({
    data: {
      provider,
      eventType: parsed.eventType,
      externalEventId: parsed.externalEventId,
      signature: parsed.signature,
      payload: parsed.payload as any,
      headers: parsed.headers as any,
      processingStatus: WebhookProcessingStatus.RECEIVED,
    },
  });

  try {
    const result = await adapter.processWebhook({
      parsed,
      rawBody,
      signatureValid,
    });

    await prisma.paymentWebhookEvent.update({
      where: { id: webhookEvent.id },
      data: {
        orderId: result.orderId ?? null,
        paymentId: result.paymentId ?? null,
        processingStatus: result.ignored
          ? WebhookProcessingStatus.IGNORED
          : WebhookProcessingStatus.PROCESSED,
        processedAt: new Date(),
      },
    });

    return { ok: true, duplicated: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error("Webhook processing failed", {
      provider,
      externalEventId: parsed.externalEventId,
      message,
    });

    await prisma.paymentWebhookEvent.update({
      where: { id: webhookEvent.id },
      data: {
        processingStatus: WebhookProcessingStatus.FAILED,
        processingError: message,
        processedAt: new Date(),
      },
    });

    throw error;
  }
}