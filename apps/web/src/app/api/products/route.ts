import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@bigbazar/database';
import { productFilterSchema } from '@bigbazar/validation';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    // Helper to get array parameters
    const getArray = (key: string) => {
        const val = searchParams.getAll(key);
        if (val.length === 1 && val[0].includes(',')) {
            return val[0].split(',');
        }
        return val;
    };

    const filters = {
        q: searchParams.get('q') || searchParams.get('search') || undefined,
        category: searchParams.get('category') || undefined,
        brand: searchParams.get('brand') || undefined,
        minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
        maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
        sizes: getArray('sizes'),
        colors: getArray('colors'),
        rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
        inStock: searchParams.get('inStock') === 'true' ? true : searchParams.get('inStock') === 'false' ? false : undefined,
        sortBy: searchParams.get('sortBy') as any || 'newest',
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '12'),
    };

    try {
        const validation = productFilterSchema.safeParse(filters);
        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error.format() }, { status: 400 });
        }

        const result = await ProductService.list(validation.data);

        return NextResponse.json({
            success: true,
            data: result.products,
            pagination: result.pagination
        });
    } catch (error) {
        console.error('Products API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation (ideally use createProductSchema)
        const product = await ProductService.create({
            name: body.name,
            slug: body.slug,
            description: body.description,
            shortDescription: body.shortDescription,
            categoryId: body.categoryId,
            brandId: body.brandId,
            sku: body.sku,
            basePrice: body.basePrice,
            salePrice: body.salePrice,
            stockQuantity: body.stockQuantity,
            isActive: body.isActive,
            isFeatured: body.isFeatured,
        });

        return NextResponse.json({
            success: true,
            data: product,
            message: 'Product created successfully',
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create Product Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create product' },
            { status: 500 }
        );
    }
}
