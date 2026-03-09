import { PaymentProvider } from "@prisma/client";
import { getCheckoutCart } from "./get-checkout-cart";

export async function validateCheckout(input: {
  provider: PaymentProvider;
}) {
  if (input.provider !== PaymentProvider.MERCADOPAGO) {
    throw new Error("Proveedor de pago no soportado");
  }

  const cart = await getCheckoutCart();

  return { cart };
}