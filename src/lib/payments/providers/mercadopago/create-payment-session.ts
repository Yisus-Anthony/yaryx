import type {
    CreatePaymentSessionInput,
    CreatePaymentSessionResult,
} from "@/lib/payments/types";
import prisma from "@/lib/prisma";
import { PaymentProvider, PaymentStatus } from "@prisma/client";

function normalizeMethod(value: unknown): string {
    return String(value ?? "")
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, "_");
}

function isCardMethod(method: string): boolean {
    return [
        "CARD",
        "CREDIT_CARD",
        "DEBIT_CARD",
        "CREDIT",
        "DEBIT",
    ].includes(method);
}

function isCashMethod(method: string): boolean {
    return [
        "CASH",
        "OXXO",
        "OXXO_PAY",
        "TICKET",
        "PAYCASH",
        "ATM",
        "STORE",
        "CONVENIENCE_STORE",
    ].includes(method);
}

export async function createMercadoPagoPaymentSession(
    input: CreatePaymentSessionInput
): Promise<CreatePaymentSessionResult> {
    const payment = await prisma.payment.findUnique({
        where: { id: input.paymentId },
        select: {
            id: true,
            orderId: true,
            provider: true,
            method: true,
            status: true,
            providerStatus: true,
            externalPaymentId: true,
            externalOrderId: true,
            externalReference: true,
            requestPayload: true,
            responsePayload: true,
            expiresAt: true,
        },
    });

    if (!payment) {
        throw new Error(`No se encontró el payment con id "${input.paymentId}"`);
    }

    if (payment.orderId !== input.orderId) {
        throw new Error(
            `El payment "${input.paymentId}" no pertenece a la orden "${input.orderId}"`
        );
    }

    if (payment.provider !== PaymentProvider.MERCADOPAGO) {
        throw new Error(
            `El payment "${input.paymentId}" no pertenece al provider Mercado Pago`
        );
    }

    const normalizedMethod = normalizeMethod(payment.method);

    if (!isCardMethod(normalizedMethod) && !isCashMethod(normalizedMethod)) {
        throw new Error(
            `Método de pago no soportado para Mercado Pago: "${String(payment.method)}"`
        );
    }

    return {
        provider: payment.provider,
        method: payment.method,
        status: payment.status ?? PaymentStatus.PENDING,
        providerStatus: payment.providerStatus,
        externalPaymentId: payment.externalPaymentId,
        externalOrderId: payment.externalOrderId,
        externalReference: payment.externalReference,
        requestPayload: payment.requestPayload,
        responsePayload: payment.responsePayload,
        expiresAt: payment.expiresAt,
        checkoutSessionId: null,
        approvalUrl: null,
    };
}