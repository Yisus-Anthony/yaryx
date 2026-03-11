import { PaymentMethod, PaymentStatus } from "@prisma/client";

export function mapMercadoPagoStatus(status?: string | null): PaymentStatus {
  const normalized = (status || "").toLowerCase();

  switch (normalized) {
    case "approved":
      return PaymentStatus.APPROVED;
    case "authorized":
      return PaymentStatus.AUTHORIZED;
    case "in_process":
    case "pending":
      return PaymentStatus.PENDING;
    case "rejected":
      return PaymentStatus.FAILED;
    case "cancelled":
      return PaymentStatus.CANCELLED;
    case "refunded":
    case "charged_back":
      return PaymentStatus.REFUNDED;
    default:
      return PaymentStatus.PENDING;
  }
}

export function mapMercadoPagoMethod(
  paymentTypeId?: string | null,
  paymentMethodId?: string | null
): PaymentMethod | null {
  const type = (paymentTypeId || "").toLowerCase();
  const method = (paymentMethodId || "").toLowerCase();

  if (type === "credit_card") {
    return PaymentMethod.CREDIT_CARD;
  }

  if (type === "debit_card") {
    return PaymentMethod.DEBIT_CARD;
  }

  if (type === "bank_transfer") {
    return PaymentMethod.BANK_TRANSFER;
  }

  if (type === "ticket" || type === "atm") {
    return PaymentMethod.CASH;
  }

  if (type === "account_money") {
    return PaymentMethod.WALLET;
  }

  if (
    method === "visa" ||
    method === "master" ||
    method === "mastercard" ||
    method === "amex"
  ) {
    return PaymentMethod.CREDIT_CARD;
  }

  if (method === "debvisa" || method === "debmaster") {
    return PaymentMethod.DEBIT_CARD;
  }

  if (
    method === "oxxo" ||
    method === "oxxo_pay" ||
    method === "paycash"
  ) {
    return PaymentMethod.CASH;
  }

  return null;
}