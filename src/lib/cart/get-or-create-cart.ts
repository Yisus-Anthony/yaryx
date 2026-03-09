import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export const CART_COOKIE = "cartId";

export async function getOrCreateCartId(): Promise<string> {
  const cookieStore = cookies();
  const existing = cookieStore.get(CART_COOKIE)?.value;

  if (existing) {
    const existingCart = await prisma.cart.findUnique({
      where: { id: existing },
      select: { id: true },
    });

    if (existingCart) return existing;
  }

  const cart = await prisma.cart.create({
    data: {},
    select: { id: true },
  });

  cookieStore.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return cart.id;
}