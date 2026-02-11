import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q') || '';
        const status = searchParams.get('status'); // ALL, LOW_STOCK, OUT_OF_STOCK

        const where: any = {
            OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { sku: { contains: q, mode: 'insensitive' } },
                { product: { name: { contains: q, mode: 'insensitive' } } }
            ]
        };

        if (status === 'LOW_STOCK') {
            where.stockQuantity = { gt: 0, lte: 10 };
        } else if (status === 'OUT_OF_STOCK') {
            where.stockQuantity = { lte: 0 };
        }

        const variants = await prisma.productVariant.findMany({
            where,
            include: {
                product: {
                    select: {
                        name: true,
                        category: { select: { name: true } }
                    }
                }
            },
            orderBy: { stockQuantity: 'asc' }
        });

        return NextResponse.json({ success: true, data: variants });
    } catch (error) {
        console.error('Admin Inventory API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch inventory manifest' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, stockQuantity } = body;

        const variant = await prisma.productVariant.update({
            where: { id },
            data: { stockQuantity: parseInt(stockQuantity) }
        });

        return NextResponse.json({ success: true, data: variant });
    } catch (error) {
        console.error('Admin Inventory Update API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update stock levels' }, { status: 500 });
    }
}
