import { validateProductPurchasable } from "@/lib/products/validate-product-purchasable";

type CartShape =
  | {
      items?: Array<{
        quantity: number;
        product?: {
          id: string;
          name: string;
          stock: number;
          isActive: boolean;
          price: number;
        } | null;
      }>;
    }
  | null
  | undefined;

export function validateCartStock(cart: CartShape) {
  const items = cart?.items ?? [];

  if (items.length === 0) {
    throw new Error("El carrito está vacío");
  }

  for (const item of items) {
    const product = validateProductPurchasable(item.product as any);

    if (item.quantity < 1) {
      throw new Error(`Cantidad inválida para "${product.name}"`);
    }

    if (item.quantity > product.stock) {
      throw new Error(`Sin stock suficiente para "${product.name}"`);
    }
  }

  return true;
}