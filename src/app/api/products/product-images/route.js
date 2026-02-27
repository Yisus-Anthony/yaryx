export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { products } from "../../../../data/products";

const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Faltan variables de entorno de Cloudinary");
}

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    const product = products.find((p) => p.slug === slug);
    if (!product) return NextResponse.json({ error: "Producto no existe" }, { status: 404 });

    try {
        const result = await cloudinary.api.resources({
            type: "upload",
            resource_type: "image",
            prefix: product.folder + "/",
            max_results: 200,
        });
        if (process.env.NODE_ENV === "development") {
            console.log(result.resources.map(r => r.public_id));
        }

        const items = (result.resources || []).map((r) => ({
            id: r.asset_id,
            publicId: r.public_id,
            url: r.secure_url,
            width: r.width,
            height: r.height,
        }));

        return NextResponse.json({ items });
    } catch (e) {
        return NextResponse.json(
            { error: "No se pudieron cargar imágenes", detail: String(e?.message || e) },
            { status: 500 }
        );
    }
}