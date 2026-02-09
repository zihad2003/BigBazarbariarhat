import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const limit = parseInt(searchParams.get('limit') || '20')

        let query = supabase
            .from('products')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(limit)

        if (category) {
            query = query.eq('category', category)
        }

        const { data, error } = await query

        if (error) {
            throw error
        }

        return NextResponse.json({ products: data })
    } catch (error) {
        console.error('Products fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, description, price, category, image_url, stock } = body

        const { data, error } = await supabase
            .from('products')
            .insert({
                name,
                description,
                price,
                category,
                image_url,
                stock: stock || 0,
                status: 'active',
            })
            .select()
            .single()

        if (error) {
            throw error
        }

        return NextResponse.json({ product: data }, { status: 201 })
    } catch (error) {
        console.error('Product creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        )
    }
}
