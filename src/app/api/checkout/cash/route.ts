import { NextResponse } from "next/server";
import { createMercadoPagoCashPayment } from "@/lib/payments/providers/mercadopago/create-cash-payment";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const result = await createMercadoPagoCashPayment({
            email: body.email,
            customerName: body.customerName,
            customerPhone: body.customerPhone,
        });

        return NextResponse.json(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "No se pudo generar la ficha OXXO";

        return NextResponse.json(
            { ok: false, error: message },
            { status: 400 }
        );
    }
}