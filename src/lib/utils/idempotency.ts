import { createHash, randomUUID } from "crypto";

export function createIdempotencyKey(scope: string, seed?: string) {
  const base = seed ? `${scope}:${seed}` : `${scope}:${randomUUID()}`;
  return createHash("sha256").update(base).digest("hex");
}