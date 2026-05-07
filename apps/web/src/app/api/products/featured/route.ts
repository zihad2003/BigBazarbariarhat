import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit')) || 8;
    try {
        const featured = await prisma.product.findMany({
            where: {
                featured: true,
                isActive: true
            },
            take: limit,
            include: { category: true }
        });
        const mappedFeatured = featured.map((p: any) => ({
            ...p,
            basePrice: Number(p.price),
            salePrice: p.salePrice ? Number(p.salePrice) : null,
        }));
        return NextResponse.json({ success: true, data: mappedFeatured });
    } catch (error) {
        console.error('Featured Products API Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch featured products.' }, { status: 500 });
    }
}
