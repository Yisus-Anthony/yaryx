import { NextResponse } from "next/server";
import { removeItem } from "@/lib/cart/remove-item";
import { updateItem } from "@/lib/cart/update-item";

type RouteContext = {
  params: {
    productId: string;
  };
};

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const body = await req.json();
    const cart = await updateItem(params.productId, Number(body.quantity));
    return NextResponse.json(cart);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error actualizando carrito";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const cart = await removeItem(params.productId);
    return NextResponse.json(cart);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error eliminando producto";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}