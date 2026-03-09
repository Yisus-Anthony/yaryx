export const STORE_CURRENCY = "MXN";

export function money(value: number, currency = STORE_CURRENCY) {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency,
    }).format(value);
}

export function assertValidAmount(value: number) {
    if (!Number.isFinite(value) || value < 0) {
        throw new Error("Invalid amount");
    }
    return Math.trunc(value);
}