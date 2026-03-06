"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Cart = any;

type CartContextType = {
  cart: Cart | null;
  loading: boolean;
  totals: {
    subtotal: number;
    count: number;
  };
  refresh: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<any>;
  updateQty: (productId: string, quantity: number) => Promise<any>;
  removeItem: (productId: string) => Promise<any>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/cart", { cache: "no-store" });
    const data = await res.json();
    setCart(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(async (productId: string, quantity = 1) => {
    const res = await fetch("/api/cart/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error ?? "Error agregando al carrito");
    }

    setCart(data);
    return data;
  }, []);

  const updateQty = useCallback(async (productId: string, quantity: number) => {
    const res = await fetch(`/api/cart/items/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error ?? "Error actualizando carrito");
    }

    setCart(data);
    return data;
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    const res = await fetch(`/api/cart/items/${productId}`, {
      method: "DELETE",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error ?? "Error eliminando producto");
    }

    setCart(data);
    return data;
  }, []);

  const totals = useMemo(() => {
    const items = cart?.items ?? [];
    const subtotal = items.reduce(
      (acc: number, item: any) =>
        acc + Number(item.product.price) * item.quantity,
      0,
    );
    const count = items.reduce(
      (acc: number, item: any) => acc + item.quantity,
      0,
    );

    return { subtotal, count };
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totals,
        refresh,
        addItem,
        updateQty,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return ctx;
}
