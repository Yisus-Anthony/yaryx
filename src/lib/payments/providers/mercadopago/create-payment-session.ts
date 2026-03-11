import type {
    CreatePaymentSessionInput,
    CreatePaymentSessionResult,
} from "@/lib/payments/types";
import prisma from "@/lib/prisma";
import { createMercadoPagoCardPayment } from "./create-card-payment";
import { createMercadoPagoCashPayment } from "./create-cash-payment";

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
            method: true,
            provider: true,
        },
    });

    if (!payment) {
        throw new Error(`No se encontró el payment con id "${input.paymentId}"`);
    }

    const normalizedMethod = normalizeMethod(payment.method);

    if (isCardMethod(normalizedMethod)) {
        return await createMercadoPagoCardPayment(input);
    }

    if (isCashMethod(normalizedMethod)) {
        return await createMercadoPagoCashPayment(input);
    }

    throw new Error(
        `Método de pago no soportado para Mercado Pago: "${String(payment.method)}"`
    );
}