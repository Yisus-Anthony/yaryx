type CartWithItems =
  | {
      items?: Array<{
        quantity: number;
        unitPrice?: number | null;
        product?: { price: number } | null;
      }>;
    }
  | null
  | undefined;

export function calculateCartTotals(cart: CartWithItems) {
  const items = cart?.items ?? [];

  const subtotal = items.reduce((acc, item) => {
    const unitPrice = item.unitPrice ?? item.product?.price ?? 0;
    return acc + Number(unitPrice) * item.quantity;
  }, 0);

  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    subtotal,
    count,
    totalItems: count,
    taxAmount: 0,
    shippingAmount: 0,
    discountAmount: 0,
    totalAmount: subtotal,
  };
}