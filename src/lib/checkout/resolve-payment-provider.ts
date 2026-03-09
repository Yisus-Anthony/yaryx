import { PaymentProvider } from "@prisma/client";

export function resolvePaymentProvider(value: string | null | undefined) {
  const normalized = (value || "").trim().toUpperCase();

  if (normalized === PaymentProvider.MERCADOPAGO) {
    return PaymentProvider.MERCADOPAGO;
  }

  throw new Error("Proveedor de pago inválido");
}