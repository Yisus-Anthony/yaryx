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

type CreateCashPaymentInput = {
    email: string;
    customerName?: string;
    customerPhone?: string;
};

export async function createMercadoPagoCashPayment(
    input: CreateCashPaymentInput
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
            customerEmail: input.email,
            customerName: input.customerName ?? null,
            customerPhone: input.customerPhone ?? null,
        },
    });

    const localPayment = await prisma.payment.create({
        data: {
            orderId: order.id,
            provider: PaymentProvider.MERCADOPAGO,
            method: PaymentMethod.CASH,
            status: PaymentStatus.PENDING,
            currency: order.currency,
            amount: order.totalAmount,
            externalReference: order.reference,
            idempotencyKey: createIdempotencyKey(
                "mp-cash-oxxo",
                `${order.id}:${order.reference}:${input.email}`
            ),
        },
    });

    const payload = {
        transaction_amount: Number(order.totalAmount),
        description: `Pedido ${order.reference}`,
        payment_method_id: "oxxo",
        external_reference: order.reference,
        notification_url: `${env.appUrl}/api/webhooks/mercadopago`,
        payer: {
            email: input.email,
        },
        metadata: {
            orderId: order.id,
            paymentId: localPayment.id,
            reference: order.reference,
        },
    };

    const mpPayment = await createPayment(payload, localPayment.idempotencyKey!);

    console.log(
        "Mercado Pago cash payment response:",
        JSON.stringify(mpPayment, null, 2)
    );

    const mappedStatus = mapMercadoPagoStatus(mpPayment.status);

    const ticketUrl =
        mpPayment.point_of_interaction?.transaction_data?.ticket_url ??
        mpPayment.transaction_details?.external_resource_url ??
        null;

    const barcode =
        mpPayment.point_of_interaction?.transaction_data?.barcode ??
        mpPayment.transaction_details?.barcode ??
        null;

    console.log("Mercado Pago ticket data:", {
        paymentId: mpPayment.id,
        status: mpPayment.status,
        payment_method_id: mpPayment.payment_method_id,
        ticketUrl,
        barcode,
    });

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
            metadata: {
                ticketUrl,
                barcode,
            },
        },
    });

    await prisma.order.update({
        where: { id: order.id },
        data: {
            paymentStatus: mappedStatus,
            status: OrderStatus.AWAITING_PAYMENT,
        },
    });

    return {
        ok: true,
        orderId: order.id,
        reference: order.reference,
        paymentId: updatedPayment.id,
        paymentStatus: mappedStatus,
        ticketUrl,
        barcode,
    };
}