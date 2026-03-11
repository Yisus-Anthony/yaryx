import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createOrder } from "@/lib/orders/create-order";
import { validateCheckout } from "@/lib/checkout/validate-checkout";
import { MANUAL_BANK_TRANSFER } from "@/lib/constants/manual-bank-transfer";
import {
    OrderStatus,
    PaymentMethod,
    PaymentProvider,
    PaymentStatus,
} from "@prisma/client";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { cart } = await validateCheckout({
            provider: PaymentProvider.MANUAL_TRANSFER,
        });

        const order = await createOrder({
            cart,
            currency: "MXN",
        });

        await prisma.order.update({
            where: { id: order.id },
            data: {
                status: OrderStatus.AWAITING_PAYMENT,
                paymentStatus: PaymentStatus.REQUIRES_ACTION,
                customerEmail: body.email ?? null,
                customerName: body.customerName ?? null,
                customerPhone: body.customerPhone ?? null,
                notes: "Pago pendiente por transferencia SPEI manual.",
            },
        });

        const payment = await prisma.payment.create({
            data: {
                orderId: order.id,
                provider: PaymentProvider.MANUAL_TRANSFER,
                method: PaymentMethod.BANK_TRANSFER,
                status: PaymentStatus.REQUIRES_ACTION,
                currency: order.currency,
                amount: order.totalAmount,
                externalReference: order.reference,
                metadata: {
                    bankTransferType: "SPEI_MANUAL",
                    bankName: MANUAL_BANK_TRANSFER.bankName,
                    clabe: MANUAL_BANK_TRANSFER.clabe,
                    accountHolder: MANUAL_BANK_TRANSFER.accountHolder,
                },
            },
        });

        return NextResponse.json({
            ok: true,
            orderId: order.id,
            paymentId: payment.id,
            reference: order.reference,
            total: order.totalAmount,
            bank: MANUAL_BANK_TRANSFER,
        });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "No se pudo generar la orden para transferencia";

        return NextResponse.json(
            { ok: false, error: message },
            { status: 400 }
        );
    }
}
