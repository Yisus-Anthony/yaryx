import type { ParsedWebhook } from "@/lib/payments/types";

function getHeadersObject(request: Request): Record<string, string> {
    const headers: Record<string, string> = {};

    request.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
    });

    return headers;
}

function getQueryObject(request: Request): Record<string, string> {
    const url = new URL(request.url);
    const query: Record<string, string> = {};

    url.searchParams.forEach((value, key) => {
        query[key] = value;
    });

    return query;
}

function tryParseJson(rawBody: string): unknown {
    if (!rawBody || !rawBody.trim()) {
        return null;
    }

    try {
        return JSON.parse(rawBody);
    } catch {
        return rawBody;
    }
}

function getObjectValue(obj: unknown, path: string[]): string | null {
    let current: unknown = obj;

    for (const key of path) {
        if (!current || typeof current !== "object" || !(key in current)) {
            return null;
        }

        current = (current as Record<string, unknown>)[key];
    }

    if (current == null) {
        return null;
    }

    return String(current);
}

export async function parseMercadoPagoWebhook(
    request: Request,
    rawBody: string
): Promise<ParsedWebhook> {
    const headers = getHeadersObject(request);
    const query = getQueryObject(request);
    const payload = tryParseJson(rawBody);

    const signature =
        headers["x-signature"] ??
        headers["x-signature-ts"] ??
        headers["x-hub-signature"] ??
        null;

    const eventType =
        getObjectValue(payload, ["action"]) ??
        getObjectValue(payload, ["type"]) ??
        query["type"] ??
        query["topic"] ??
        "unknown";

    const resourceType =
        getObjectValue(payload, ["type"]) ??
        query["topic"] ??
        query["type"] ??
        null;

    const resourceId =
        getObjectValue(payload, ["data", "id"]) ??
        getObjectValue(payload, ["id"]) ??
        query["data.id"] ??
        query["id"] ??
        null;

    const externalEventId =
        getObjectValue(payload, ["id"]) ??
        headers["x-request-id"] ??
        headers["x-idempotency-key"] ??
        resourceId;

    return {
        externalEventId,
        eventType,
        resourceType,
        resourceId,
        signature,
        headers,
        payload,
        query,
    };
}