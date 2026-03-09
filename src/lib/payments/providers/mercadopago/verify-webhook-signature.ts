import { createHmac, timingSafeEqual } from "crypto";
import { env } from "@/server/env";
import type { ParsedWebhook } from "@/lib/payments/types";

function parseXSignature(signature: string | null) {
    if (!signature) return { ts: null as string | null, v1: null as string | null };

    const parts = signature.split(",").map((part) => part.trim());
    let ts: string | null = null;
    let v1: string | null = null;

    for (const part of parts) {
        const [key, value] = part.split("=");
        if (key === "ts") ts = value ?? null;
        if (key === "v1") v1 = value ?? null;
    }

    return { ts, v1 };
}

export async function verifyMercadoPagoWebhookSignature(input: {
    request: Request;
    rawBody: string;
    parsed: ParsedWebhook;
}) {
    if (!env.mpWebhookSecret) {
        return true;
    }

    const { parsed } = input;
    const signatureHeader = parsed.signature;
    const requestId = parsed.headers["x-request-id"] ?? "";
    const dataId = parsed.resourceId ?? "";

    const { ts, v1 } = parseXSignature(signatureHeader);

    if (!ts || !v1 || !dataId || !requestId) {
        return false;
    }

    const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
    const digest = createHmac("sha256", env.mpWebhookSecret)
        .update(manifest)
        .digest("hex");

    try {
        return timingSafeEqual(Buffer.from(digest), Buffer.from(v1));
    } catch {
        return false;
    }
}