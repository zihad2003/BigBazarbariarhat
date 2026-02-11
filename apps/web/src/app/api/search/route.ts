import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json({ success: true, suggestions: [], products: [], categories: [] });
    }

    try {
        // Fetch products matching the query
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { brand: { name: { contains: query, mode: 'insensitive' } } },
                ],
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                basePrice: true,
                salePrice: true,
                images: {
                    take: 1,
                    orderBy: { displayOrder: 'asc' }
                }
            },
            take: 5,
        });

        // Fetch categories matching the query
        const categories = await prisma.category.findMany({
            where: {
                name: { contains: query, mode: 'insensitive' },
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                slug: true,
            },
            take: 3,
        });

        // Generate text suggestions (names of products and categories)
        const suggestions = [
            ...products.map(p => p.name),
            ...categories.map(c => c.name)
        ].slice(0, 8);

        return NextResponse.json({
            success: true,
            data: {
                suggestions,
                products,
                categories,
            }
        });
    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 });
    }
}
