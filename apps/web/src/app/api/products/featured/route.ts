import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

export const revalidate = 60; // ISR: revalidate every 60 seconds
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
        const mappedFeatured = featured.map((p: any) => {
            let productImages: any[] = [];
            try {
                productImages = typeof p.images === 'string'
                    ? JSON.parse(p.images)
                    : (Array.isArray(p.images) ? p.images : []);
            } catch (e) {}

            return {
                ...p,
                basePrice: Number(p.price),
                salePrice: p.salePrice ? Number(p.salePrice) : null,
                images: productImages,
            };
        });
        return NextResponse.json(
            { success: true, data: mappedFeatured },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                }
            }
        );
    } catch (error) {
        console.error('Featured Products API Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch featured products.' }, { status: 500 });
    }
}
