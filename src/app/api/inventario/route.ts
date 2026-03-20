import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function buildCloudinaryImageUrl(publicId: string | null) {
    const cloudName =
        process.env.CLOUDINARY_CLOUD_NAME ||
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    if (!cloudName || !publicId) return null

    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,c_fill,w_120,h_120/${publicId}`
}

export async function GET() {
    try {
        const inventario = await prisma.product.findMany({
            select: {
                id: true,
                sku: true,
                name: true,
                stock: true,
                price: true,
                isActive: true,
                coverPublicId: true,
                category: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        })

        const data = inventario.map((item) => ({
            ...item,
            imageUrl: buildCloudinaryImageUrl(item.coverPublicId),
        }))

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error al obtener inventario:', error)

        return NextResponse.json(
            { error: 'Error al obtener inventario' },
            { status: 500 }
        )
    }
}