import prisma from "@/lib/prisma";
import { retry } from "@/lib/retry";
import { Prisma, ProductCondition } from "@prisma/client";

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

export type GetProductsParams = {
    page?: number;
    pageSize?: number;
    condition?: string;
    category?: string;
};

const conditionMap: Record<string, ProductCondition> = {
    NEW: ProductCondition.NEW,
    NUEVO: ProductCondition.NEW,
    NUEVOS: ProductCondition.NEW,

    USED: ProductCondition.USED,
    USADO: ProductCondition.USED,
    USADOS: ProductCondition.USED,

    REFURBISHED: ProductCondition.REFURBISHED,
    REMANUFACTURADO: ProductCondition.REFURBISHED,
    REMANUFACTURADOS: ProductCondition.REFURBISHED,
};

export async function getProducts({
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    condition = "all",
    category = "all",
}: GetProductsParams) {
    const safePage = Math.max(1, Number(page) || 1);
    const safePageSize = Math.min(
        MAX_PAGE_SIZE,
        Math.max(1, Number(pageSize) || DEFAULT_PAGE_SIZE)
    );

    const normalizedCondition = condition.trim().toUpperCase();
    const normalizedCategory = category.trim().toLowerCase();

    const where: Prisma.ProductWhereInput = {
        isActive: true,
    };

    if (normalizedCondition !== "ALL") {
        const mappedCondition = conditionMap[normalizedCondition];

        if (!mappedCondition) {
            throw new Error(`Invalid condition: ${condition}`);
        }

        where.condition = mappedCondition;
    }

    if (normalizedCategory !== "all") {
        where.category = {
            is: {
                slug: normalizedCategory,
            },
        };
    }

    const [total, items] = await Promise.all([
        retry(() => prisma.product.count({ where })),
        retry(() =>
            prisma.product.findMany({
                where,
                orderBy: { updatedAt: "desc" },
                skip: (safePage - 1) * safePageSize,
                take: safePageSize,
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    folder: true,
                    coverPublicId: true,
                    condition: true,
                    categoryId: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                    price: true,
                    stock: true,
                    createdAt: true,
                    updatedAt: true,
                },
            })
        ),
    ]);

    return {
        items,
        page: safePage,
        pageSize: safePageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / safePageSize)),
    };
}

export async function getProductCategories() {
    return prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: {
            id: true,
            name: true,
            slug: true,
        },
    });
}