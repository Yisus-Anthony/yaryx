import { NextResponse } from "next/server";
import { createMercadoPagoCashPayment } from "@/lib/payments/providers/mercadopago/create-cash-payment";

type CashRouteBody = {
    email?: string;
    customerName?: string;
    customerPhone?: string;
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as CashRouteBody;

        const email = body.email?.trim();
        const customerName = body.customerName?.trim();
        const customerPhone = body.customerPhone?.trim();

        if (!email) {
            return NextResponse.json(
                { ok: false, error: "Falta email para generar la ficha OXXO" },
                { status: 400 }
            );
        }

        const result = await createMercadoPagoCashPayment({
            email,
            customerName,
            customerPhone,
        });

        return NextResponse.json(result);
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "No se pudo generar la ficha OXXO";

        return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }
}