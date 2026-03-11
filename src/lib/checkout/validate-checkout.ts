import { PaymentProvider } from "@prisma/client";
import { getCheckoutCart } from "./get-checkout-cart";

export async function validateCheckout(input: {
  provider: PaymentProvider;
}) {
  const supportedProviders = new Set<PaymentProvider>([
    PaymentProvider.MERCADOPAGO,
    PaymentProvider.MANUAL_TRANSFER,
  ]);

  if (!supportedProviders.has(input.provider)) {
    throw new Error("Proveedor de pago no soportado");
  }

  const cart = await getCheckoutCart();

  return { cart };
}