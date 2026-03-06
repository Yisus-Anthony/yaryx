import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const CART_COOKIE = "cartId";

export async function getOrCreateCartId(): Promise<string> {
    const cookieStore = cookies();
    const existing = cookieStore.get(CART_COOKIE)?.value;
    if (existing) return existing;

    const cart = await prisma.cart.create({ data: {} });

    cookieStore.set(CART_COOKIE, cart.id, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });

    return cart.id;
}

export async function getCart() {
    const cartId = await getOrCreateCartId();

    return prisma.cart.findUnique({
        where: { id: cartId },
        include: {
            items: {
                include: { product: true },
                orderBy: { createdAt: "asc" },
            },
        },
    });
}