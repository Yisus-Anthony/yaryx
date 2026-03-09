import type { Product } from "@prisma/client";

export function validateProductPurchasable(product: Product | null | undefined) {
    if (!product) {
        throw new Error("Producto no existe");
    }

    if (!product.isActive) {
        throw new Error(`El producto "${product.name}" no está disponible`);
    }

    if (product.stock <= 0) {
        throw new Error(`El producto "${product.name}" no tiene stock`);
    }

    if (!Number.isFinite(product.price) || product.price < 0) {
        throw new Error(`El producto "${product.name}" tiene un precio inválido`);
    }

    return product;
}