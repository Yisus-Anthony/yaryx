import { env } from "@/server/env";

const MP_API_BASE = "https://api.mercadopago.com";

async function mpFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${MP_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.mpAccessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(
      `Mercado Pago API error (${res.status}): ${JSON.stringify(data)}`
    );
  }

  return data as T;
}

export async function createPreference(payload: unknown) {
  return mpFetch<{
    id: string;
    init_point?: string;
    sandbox_init_point?: string;
    date_of_expiration?: string | null;
  }>("/checkout/preferences", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getPaymentById(paymentId: string) {
  return mpFetch<{
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
    order?: {
      id?: string | number | null;
    } | null;
  }>(`/v1/payments/${paymentId}`, {
    method: "GET",
  });
}