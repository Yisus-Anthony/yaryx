import { NextResponse } from "next/server";
import { createCheckout } from "@/lib/checkout/create-checkout";
import { resolvePaymentProvider } from "@/lib/checkout/resolve-payment-provider";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const provider = resolvePaymentProvider(body?.provider);

    const result = await createCheckout({ provider });

    return NextResponse.json({
      ok: true,
      orderId: result.order.id,
      reference: result.order.reference,
      paymentId: result.payment.id,
      redirectUrl: result.redirectUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error en checkout";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 400 }
    );
  }
}