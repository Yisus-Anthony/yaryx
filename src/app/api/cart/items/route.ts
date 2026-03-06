import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getOrCreateCartId } from "@/lib/cart";

export async function POST(req: Request) {
    const { productId, quantity } = await req.json();

    if (!productId) {
        return NextResponse.json({ error: "productId requerido" }, { status: 400 });
    }

    const qty = Math.max(1, Number(quantity ?? 1));
    const cartId = await getOrCreateCartId();

    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product) {
        return NextResponse.json({ error: "Producto no existe" }, { status: 404 });
    }

    const stock = product.stock ?? 0;

    if (qty > stock) {
        return NextResponse.json({ error: "Sin stock suficiente" }, { status: 409 });
    }

    const existing = await prisma.cartItem.findUnique({
        where: { cartId_productId: { cartId, productId } },
    });

    const nextQty = existing ? existing.quantity + qty : qty;

    if (nextQty > stock) {
        return NextResponse.json({ error: "Sin stock suficiente" }, { status: 409 });
    }

    await prisma.cartItem.upsert({
        where: { cartId_productId: { cartId, productId } },
        create: { cartId, productId, quantity: qty },
        update: { quantity: nextQty },
    });

    const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
            items: {
                include: { product: true },
                orderBy: { createdAt: "asc" },
            },
        },
    });

    return NextResponse.json(cart);
}