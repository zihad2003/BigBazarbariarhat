import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    try {
        const [category, productsResult] = await Promise.all([
            db.categories.findBySlug(slug),
            db.products.findMany({
                category: slug,
                page: Number(searchParams.get('page')) || 1,
                limit: Number(searchParams.get('limit')) || 12,
            }),
        ]);

        if (!category) {
            return NextResponse.json({ success: false, message: 'Category not found.' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: { ...category, ...productsResult } });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to fetch category.' }, { status: 500 });
    }
}
