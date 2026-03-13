import { Prisma, ProductCondition } from "@prisma/client";
import prisma from "@/lib/prisma";

type GetProductsParams = {
    page?: number;
    condition?: string;
    category?: string;
    vehicleType?: string;
};

type CategoryTreeNode = {
    id: string;
    sku: string;
    name: string;
    slug: string;
    children: CategoryTreeNode[];
};

const PAGE_SIZE = 12;

const CONDITION_ORDER = ["nuevo", "usado", "remanufacturado"] as const;

const CONDITION_TO_ENUM: Record<string, ProductCondition> = {
    nuevo: ProductCondition.NEW,
    usado: ProductCondition.USED,
    remanufacturado: ProductCondition.REFURBISHED,
};

const ENUM_TO_CONDITION: Record<ProductCondition, string> = {
    NEW: "nuevo",
    USED: "usado",
    REFURBISHED: "remanufacturado",
};

const CONDITION_LABELS: Record<string, string> = {
    nuevo: "Nuevo",
    usado: "Usado",
    remanufacturado: "Remanufacturado",
};

function normalizePage(page?: number): number {
    if (!page || !Number.isFinite(page) || page < 1) return 1;
    return Math.floor(page);
}

async function getCategoryIdsFromTree(slug: string): Promise<string[]> {
    const root = await prisma.category.findFirst({
        where: {
            slug,
            isActive: true,
        },
        select: {
            id: true,
            children: {
                where: { isActive: true },
                select: {
                    id: true,
                    children: {
                        where: { isActive: true },
                        select: { id: true },
                    },
                },
            },
        },
    });

    if (!root) return [];

    return [
        root.id,
        ...root.children.map((child) => child.id),
        ...root.children.flatMap((child) => child.children.map((sub) => sub.id)),
    ];
}

export async function getProducts({
    page = 1,
    condition = "all",
    category = "all",
    vehicleType = "all",
}: GetProductsParams) {
    const safePage = normalizePage(page);

    const where: Prisma.ProductWhereInput = {
        isActive: true,
    };

    if (condition !== "all" && CONDITION_TO_ENUM[condition]) {
        where.condition = CONDITION_TO_ENUM[condition];
    }

    if (category !== "all") {
        const categoryIds = await getCategoryIdsFromTree(category);

        if (categoryIds.length === 0) {
            where.categoryId = "__no_match__";
        } else {
            where.categoryId = { in: categoryIds };
        }
    }

    if (vehicleType !== "all") {
        where.vehicleTypes = {
            some: {
                vehicleType: {
                    slug: vehicleType,
                    isActive: true,
                },
            },
        };
    }

    const total = await prisma.product.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const currentPage = Math.min(safePage, totalPages);

    const items = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
            id: true,
            slug: true,
            name: true,
            price: true,
            coverPublicId: true,
        },
    });

    return {
        items,
        total,
        page: currentPage,
        totalPages,
    };
}

export async function getProductFiltersMeta() {
    const [conditionsRaw, vehicleTypesRaw, categoryRoots] = await Promise.all([
        prisma.product.groupBy({
            by: ["condition"],
            where: {
                isActive: true,
            },
        }),

        prisma.vehicleType.findMany({
            where: {
                isActive: true,
                products: {
                    some: {
                        product: {
                            isActive: true,
                        },
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        }),

        prisma.category.findMany({
            where: {
                isActive: true,
                parentId: null,
            },
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
                slug: true,
                children: {
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        name: "asc",
                    },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        children: {
                            where: {
                                isActive: true,
                            },
                            orderBy: {
                                name: "asc",
                            },
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
        }),
    ]);

    const conditions = conditionsRaw
        .map((item) => {
            const value = ENUM_TO_CONDITION[item.condition];
            return {
                value,
                label: CONDITION_LABELS[value] ?? value,
            };
        })
        .sort(
            (a, b) =>
                CONDITION_ORDER.indexOf(a.value as (typeof CONDITION_ORDER)[number]) -
                CONDITION_ORDER.indexOf(b.value as (typeof CONDITION_ORDER)[number])
        );

    return {
        conditions,
        vehicleTypes: vehicleTypesRaw,
        categories: categoryRoots as CategoryTreeNode[],
    };
}