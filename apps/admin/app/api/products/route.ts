import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@bigbazar/database';
import { createProductSchema, productFilterSchema } from '@bigbazar/validation';

export async function POST(request: NextRequest) {
    try {
        const json = await request.json();
        const body = createProductSchema.parse(json);
        const product = await ProductService.create(body);

        return NextResponse.json({ success: true, data: product });
    } catch (error: any) {
        console.error('Admin Product Create API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to create product'
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filters = productFilterSchema.parse({
            category: searchParams.get('category') || undefined,
            brand: searchParams.get('brand') || undefined,
            page: parseInt(searchParams.get('page') || '1'),
            limit: parseInt(searchParams.get('limit') || '10'),
            sortBy: searchParams.get('sortBy') || 'newest',
            q: searchParams.get('q') || undefined,
        });

        const result = await ProductService.list(filters as any);

        return NextResponse.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Admin Products List API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }
}
