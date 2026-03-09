import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const page = Math.max(1, Number(searchParams.get("page") || "1"));
        const pageSize = Math.min(
            50,
            Math.max(1, Number(searchParams.get("pageSize") || "20"))
        );

        const condition = searchParams.get("condition") || "all";
        const category = searchParams.get("category") || "all";

        const where: any = {};
        if (condition !== "all") where.condition = condition;
        if (category !== "all") where.category = category;

        const [total, items] = await Promise.all([
            prisma.product.count({ where }),
            prisma.product.findMany({
                where,
                orderBy: { updatedAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ]);

        return NextResponse.json({
            items,
            page,
            pageSize,
            total,
            totalPages: Math.max(1, Math.ceil(total / pageSize)),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}