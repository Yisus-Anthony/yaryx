import prisma from "@/lib/prisma";
import { env } from "@/server/env";
import { createIdempotencyKey } from "@/lib/utils/idempotency";
import { createOrder } from "@/lib/orders/create-order";
import { validateCheckout } from "@/lib/checkout/validate-checkout";
import {
    OrderStatus,
    PaymentMethod,
    PaymentProvider,
    PaymentStatus,
} from "@prisma/client";
import { createPayment } from "./client";
import { mapMercadoPagoStatus } from "./map-payment-status";

export type CreateCardPaymentInput = {
    token: string;
    issuer_id?: string | number | null;
    payment_method_id: string;
    installments: number;
    payer: {
        email: string;
        identification?: {
            type?: string;
            number?: string;
        };
    };
    customer?: {
        name?: string;
        phone?: string;
    };
};

export async function createMercadoPagoCardPayment(
    input: CreateCardPaymentInput
) {
    const { cart } = await validateCheckout({
        provider: PaymentProvider.MERCADOPAGO,
    });

    const order = await createOrder({
        cart,
        currency: "MXN",
    });

    await prisma.order.update({
        where: { id: order.id },
        data: {
            status: OrderStatus.AWAITING_PAYMENT,
            customerEmail: input.payer.email,
            customerName: input.customer?.name ?? null,
            customerPhone: input.customer?.phone ?? null,
        },
    });

    const localPayment = await prisma.payment.create({
        data: {
            orderId: order.id,
            provider: PaymentProvider.MERCADOPAGO,
            method: PaymentMethod.CARD,
            status: PaymentStatus.PENDING,
            currency: order.currency,
            amount: order.totalAmount,
            externalReference: order.reference,
            idempotencyKey: createIdempotencyKey(
                "mp-card",
                `${order.id}:${order.reference}:${input.payer.email}`
            ),
        },
    });

    const payload = {
        transaction_amount: Number(order.totalAmount),
        token: input.token,
        description: `Pedido ${order.reference}`,
        installments: Number(input.installments),
        payment_method_id: input.payment_method_id,
        issuer_id: input.issuer_id ? String(input.issuer_id) : undefined,
        payer: {
            email: input.payer.email,
            identification: input.payer.identification
                ? {
                    type: input.payer.identification.type,
                    number: input.payer.identification.number,
                }
                : undefined,
        },
        external_reference: order.reference,
        notification_url: `${env.appUrl}/api/webhooks/mercadopago`,
        metadata: {
            orderId: order.id,
            paymentId: localPayment.id,
            reference: order.reference,
        },
    };

    console.log("CARD INPUT:", JSON.stringify(input, null, 2));
    console.log("CARD MP PAYLOAD:", JSON.stringify(payload, null, 2));

    const mpPayment = await createPayment(payload, localPayment.idempotencyKey!);

    console.log("CARD MP RESPONSE:", JSON.stringify(mpPayment, null, 2));

    const mappedStatus = mapMercadoPagoStatus(mpPayment.status);

    const updatedPayment = await prisma.payment.update({
        where: { id: localPayment.id },
        data: {
            status: mappedStatus,
            providerStatus: mpPayment.status ?? null,
            externalPaymentId: mpPayment.id ? String(mpPayment.id) : null,
            externalOrderId: mpPayment.order?.id ? String(mpPayment.order.id) : null,
            externalReference: mpPayment.external_reference ?? order.reference,
            requestPayload: payload,
            responsePayload: mpPayment,
        },
    });

    await prisma.order.update({
        where: { id: order.id },
        data: {
            paymentStatus: mappedStatus,
            status:
                mappedStatus === PaymentStatus.APPROVED
                    ? OrderStatus.PAID
                    : OrderStatus.AWAITING_PAYMENT,
        },
    });

    return {
        ok: true,
        orderId: order.id,
        reference: order.reference,
        paymentId: updatedPayment.id,
        paymentStatus: mappedStatus,
        mercadoPagoStatus: mpPayment.status ?? null,
    };
}