import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const search = searchParams.get('q') || searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const onSale = searchParams.get('onSale') === 'true';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    try {
        let query = supabaseAdmin
            .from('products')
            .select('*, categories(*)', { count: 'exact' })
            .eq('is_active', true);

        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }

        if (category) {
            query = query.eq('category_id', category);
        }

        if (featured) {
            query = query.eq('is_featured', true);
        }

        if (minPrice !== undefined) {
            query = query.gte('base_price', minPrice);
        }

        if (maxPrice !== undefined) {
            query = query.lte('base_price', maxPrice);
        }

        if (onSale) {
            query = query.not('sale_price', 'is', null);
        }

        // Sorting
        switch (sortBy) {
            case 'price_asc':
                query = query.order('base_price', { ascending: true });
                break;
            case 'price_desc':
                query = query.order('base_price', { ascending: false });
                break;
            case 'newest':
            default:
                query = query.order('created_at', { ascending: false });
                break;
        }

        query = query.range(offset, offset + limit - 1);

        const { data: products, count, error } = await query as any;

        if (error) {
            console.error('Products query error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        const total = count || 0;
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            }
        });
    } catch (error) {
        console.error('Products API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { data: product, error } = await supabaseAdmin
            .from('products')
            .insert({
                name: body.name,
                slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                description: body.description,
                category_id: body.categoryId,
                sku: body.sku,
                base_price: body.basePrice,
                sale_price: body.salePrice,
                stock_quantity: body.stockQuantity || 0,
                is_active: body.isActive !== undefined ? body.isActive : true,
                is_featured: body.isFeatured || false,
            } as any)
            .select()
            .single();

        if (error) {
            console.error('Create product error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: product,
            message: 'Product created successfully',
        }, { status: 201 });
    } catch (error) {
        console.error('Create Product Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
