import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const { data: product, error } = await supabaseAdmin
            .from('products')
            .select('*, categories(*)')
            .eq('slug', slug)
            .single() as any;

        if (error || !product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Product Detail API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch product details' }, { status: 500 });
    }
}
