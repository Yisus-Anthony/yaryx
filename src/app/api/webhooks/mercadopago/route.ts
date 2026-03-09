import { NextResponse } from "next/server";
import { PaymentProvider } from "@prisma/client";
import { handleWebhook } from "@/lib/payments/handle-webhook";

export async function POST(request: Request) {
  try {
    await handleWebhook(PaymentProvider.MERCADOPAGO, request);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}