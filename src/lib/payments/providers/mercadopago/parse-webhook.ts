import type { ParsedWebhook } from "@/lib/payments/types";
import { safeJsonParse } from "@/lib/utils/safe-json";

function headersToObject(headers: Headers) {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key.toLowerCase()] = value;
  });
  return result;
}

export async function parseMercadoPagoWebhook(
  request: Request,
  rawBody: string
): Promise<ParsedWebhook> {
  const url = new URL(request.url);
  const payload = safeJsonParse<any>(rawBody) ?? {};

  const query = Object.fromEntries(url.searchParams.entries());
  const headers = headersToObject(request.headers);

  const resourceId =
    payload?.data?.id?.toString?.() ??
    query["data.id"] ??
    query["id"] ??
    null;

  const resourceType =
    payload?.type?.toString?.() ??
    query["type"] ??
    query["topic"] ??
    null;

  const eventType =
    payload?.action?.toString?.() ??
    resourceType ??
    "unknown";

  const externalEventId =
    headers["x-request-id"] ??
    query["id"] ??
    resourceId ??
    null;

  return {
    externalEventId,
    eventType,
    resourceType,
    resourceId,
    signature: headers["x-signature"] ?? null,
    headers,
    payload,
    query,
  };
}