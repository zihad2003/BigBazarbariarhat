export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();
    const limit = Number(searchParams.get('limit')) || 10;

    if (!query) {
        return NextResponse.json({ success: true, data: [] });
    }

    if (query.length > 100) {
        return NextResponse.json({ success: false, message: 'Search query too long.' }, { status: 400 });
    }

    try {
        const results = await prisma.product.findMany({
            where: {
                isActive: true,
                OR: [
                    { name: { contains: query } },
                    { description: { contains: query } },
                    { sku: { contains: query } },
                ],
            },
            take: limit,
            include: { category: true }
        });
        const mappedResults = results.map((p: any) => ({
            ...p,
            basePrice: Number(p.price),
            salePrice: p.salePrice ? Number(p.salePrice) : null,
        }));
        return NextResponse.json({ success: true, data: mappedResults });
    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json({ success: false, message: 'Search failed.' }, { status: 500 });
    }
}
