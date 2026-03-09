import { NextResponse } from "next/server";
import { addItem } from "@/lib/cart/add-item";

export async function POST(req: Request) {
    try {
        const { productId, quantity } = await req.json();
        const cart = await addItem(productId, quantity);
        return NextResponse.json(cart);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error agregando al carrito";

        return NextResponse.json({ error: message }, { status: 400 });
    }
}