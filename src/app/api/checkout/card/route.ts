import { NextResponse } from "next/server";
import { createMercadoPagoCardPayment } from "@/lib/payments/providers/mercadopago/create-card-payment";

type CardRouteBody = {
  token?: string;
  issuer_id?: string | number | null;
  issuerId?: string | number | null;
  payment_method_id?: string;
  paymentMethodId?: string;
  installments?: string | number | null;
  payer?: {
    email?: string;
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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CardRouteBody;

    console.log("CARD ROUTE RAW BODY:", JSON.stringify(body, null, 2));

    const token = body.token?.trim();
    const paymentMethodId =
      body.payment_method_id?.trim() ?? body.paymentMethodId?.trim();
    const payerEmail = body.payer?.email?.trim();
    const installments = Number(body.installments ?? 1);

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Falta token de tarjeta" },
        { status: 400 }
      );
    }

    if (!paymentMethodId) {
      return NextResponse.json(
        { ok: false, error: "Falta payment_method_id" },
        { status: 400 }
      );
    }

    if (!payerEmail) {
      return NextResponse.json(
        { ok: false, error: "Falta payer.email" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(installments) || installments < 1) {
      return NextResponse.json(
        { ok: false, error: "Installments inválido" },
        { status: 400 }
      );
    }

    const normalized = {
      token,
      issuer_id: body.issuer_id ?? body.issuerId ?? null,
      payment_method_id: paymentMethodId,
      installments,
      payer: {
        email: payerEmail,
        identification: body.payer?.identification
          ? {
            type: body.payer.identification.type,
            number: body.payer.identification.number,
          }
          : undefined,
      },
      customer: {
        name: body.customer?.name?.trim(),
        phone: body.customer?.phone?.trim(),
      },
    };

    console.log("CARD ROUTE NORMALIZED:", JSON.stringify(normalized, null, 2));

    const result = await createMercadoPagoCardPayment(normalized);

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    console.error("CARD ROUTE ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "No se pudo procesar el pago con tarjeta";

    const status = message.includes("Mercado Pago API error (500)")
      ? 502
      : 400;

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}