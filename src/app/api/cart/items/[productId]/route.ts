import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getOrCreateCartId } from "@/lib/cart";

export async function PATCH(
    req: Request,
    ctx: { params: { productId: string } }
) {
    const { productId } = ctx.params;
    const { quantity } = await req.json();

    const cartId = await getOrCreateCartId();
    const qty = Number(quantity);

    if (!Number.isFinite(qty) || qty < 1) {
        return NextResponse.json({ error: "quantity inválida" }, { status: 400 });
    }

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

    if (!existing) {
        return NextResponse.json(
            { error: "El producto no está en el carrito" },
            { status: 404 }
        );
    }

    await prisma.cartItem.update({
        where: { cartId_productId: { cartId, productId } },
        data: { quantity: qty },
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

export async function DELETE(
    _req: Request,
    ctx: { params: { productId: string } }
) {
    const { productId } = ctx.params;
    const cartId = await getOrCreateCartId();

    const existing = await prisma.cartItem.findUnique({
        where: { cartId_productId: { cartId, productId } },
    });

    if (!existing) {
        return NextResponse.json(
            { error: "El producto no está en el carrito" },
            { status: 404 }
        );
    }

    await prisma.cartItem.delete({
        where: { cartId_productId: { cartId, productId } },
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