import { PaymentProvider } from "@prisma/client";
import { validateCheckout } from "./validate-checkout";
import { createOrder } from "@/lib/orders/create-order";
import { createPaymentSession } from "@/lib/payments/create-payment-session";

export async function createCheckout(input: {
  provider: PaymentProvider;
}) {
  const { cart } = await validateCheckout(input);

  const order = await createOrder({
    cart,
    currency: "MXN",
  });

  const payment = await createPaymentSession({
    orderId: order.id,
    provider: input.provider,
  });

  return {
    order,
    payment,
    redirectUrl: payment.approvalUrl,
  };
}