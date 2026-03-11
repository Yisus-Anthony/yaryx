import { env } from "@/server/env";

const MP_API_BASE = "https://api.mercadopago.com";

type MpFetchOptions = RequestInit & {
  idempotencyKey?: string;
};

async function mpFetch<T>(
  path: string,
  init?: MpFetchOptions
): Promise<T> {
  if (!env.mpAccessToken) {
    throw new Error("Falta configurar mpAccessToken");
  }

  const headers = new Headers(init?.headers ?? {});
  headers.set("Authorization", `Bearer ${env.mpAccessToken}`);
  headers.set("Content-Type", "application/json");

  if (init?.idempotencyKey) {
    headers.set("X-Idempotency-Key", init.idempotencyKey);
  }

  const url = `${MP_API_BASE}${path}`;

  const res = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });

  const rawText = await res.text();

  let data: unknown = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = rawText;
  }

  if (!res.ok) {
    const responseHeaders = Object.fromEntries(res.headers.entries());

    console.error("MP FETCH URL:", url);
    console.error("MP FETCH METHOD:", init?.method ?? "GET");
    console.error("MP FETCH STATUS:", res.status);
    console.error("MP FETCH HEADERS:", responseHeaders);
    console.error("MP FETCH BODY:", data);

    throw new Error(
      `Mercado Pago API error (${res.status}): ${JSON.stringify(data)}`
    );
  }

  return data as T;
}

export type MercadoPagoPaymentResponse = {
  id: number | string;
  status?: string;
  status_detail?: string;
  external_reference?: string;
  transaction_amount?: number;
  currency_id?: string;
  date_approved?: string | null;
  date_created?: string | null;
  date_last_updated?: string | null;
  payment_type_id?: string | null;
  payment_method_id?: string | null;
  transaction_details?: {
    external_resource_url?: string | null;
    barcode?: string | null;
    financial_institution?: string | null;
    bank_transfer_id?: number | string | null;
  } | null;
  point_of_interaction?: {
    transaction_data?: {
      ticket_url?: string | null;
      qr_code?: string | null;
      barcode?: string | null;
    } | null;
  } | null;
  order?: { id?: string | number | null } | null;
};

export async function createPayment(
  payload: unknown,
  idempotencyKey: string
) {
  return mpFetch<MercadoPagoPaymentResponse>("/v1/payments", {
    method: "POST",
    body: JSON.stringify(payload),
    idempotencyKey,
  });
}

export async function getPaymentById(paymentId: string) {
  return mpFetch<MercadoPagoPaymentResponse>(`/v1/payments/${paymentId}`, {
    method: "GET",
  });
}