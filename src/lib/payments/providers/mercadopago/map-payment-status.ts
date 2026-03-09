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

export function mapMercadoPagoMethod(paymentTypeId?: string | null): PaymentMethod | null {
  const value = (paymentTypeId || "").toLowerCase();

  switch (value) {
    case "credit_card":
      return PaymentMethod.CREDIT_CARD;
    case "debit_card":
      return PaymentMethod.DEBIT_CARD;
    case "bank_transfer":
      return PaymentMethod.BANK_TRANSFER;
    case "ticket":
    case "atm":
      return PaymentMethod.CASH;
    case "account_money":
      return PaymentMethod.WALLET;
    default:
      return null;
  }
}