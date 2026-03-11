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

        const email =
            typeof body?.email === "string" ? body.email.trim() : "";
        const customerName =
            typeof body?.customerName === "string" ? body.customerName.trim() : "";
        const customerPhone =
            typeof body?.customerPhone === "string" ? body.customerPhone.trim() : "";

        if (!email) {
            return NextResponse.json(
                { ok: false, error: "Falta el correo del cliente" },
                { status: 400 }
            );
        }

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
                paymentStatus: PaymentStatus.PENDING,
                customerEmail: email,
                customerName: customerName || null,
                customerPhone: customerPhone || null,
                notes: "Pago pendiente por transferencia SPEI manual.",
            },
        });

        const payment = await prisma.payment.create({
            data: {
                orderId: order.id,
                provider: PaymentProvider.MANUAL_TRANSFER,
                method: PaymentMethod.BANK_TRANSFER,
                status: PaymentStatus.PENDING,
                currency: order.currency,
                amount: order.totalAmount,
                externalReference: order.reference,
                metadata: {
                    bankTransferType: "SPEI_MANUAL",
                    bankName: MANUAL_BANK_TRANSFER.bankName,
                    clabe: MANUAL_BANK_TRANSFER.clabe,
                    accountHolder: MANUAL_BANK_TRANSFER.accountHolder,
                    accountNumber: MANUAL_BANK_TRANSFER.accountNumber,
                    cardReference: MANUAL_BANK_TRANSFER.cardReference,
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
        console.error("MANUAL TRANSFER ERROR:", error);

        const message =
            error instanceof Error
                ? error.message
                : "No se pudo generar la orden para transferencia";

        return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }
}