import { getCart } from "@/lib/cart/get-cart";
import { validateCartStock } from "@/lib/cart/validate-stock";

export async function getCheckoutCart() {
  const cart = await getCart();

  if (!cart) {
    throw new Error("No se pudo cargar el carrito");
  }

  validateCartStock(cart);

  return cart;
}