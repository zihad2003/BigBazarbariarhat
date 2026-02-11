import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json({ success: true, suggestions: [], products: [], categories: [] });
    }

    try {
        // Fetch products matching the query
        const { data: products } = await supabaseAdmin
            .from('products')
            .select('id, name, slug, base_price, sale_price')
            .eq('is_active', true)
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
            .limit(5) as any;

        // Fetch categories matching the query
        const { data: categories } = await supabaseAdmin
            .from('categories')
            .select('id, name, slug')
            .ilike('name', `%${query}%`)
            .limit(3) as any;

        const suggestions = [
            ...(products || []).map((p: any) => p.name),
            ...(categories || []).map((c: any) => c.name)
        ].slice(0, 8);

        return NextResponse.json({
            success: true,
            data: {
                suggestions,
                products: products || [],
                categories: categories || [],
            }
        });
    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 });
    }
}
