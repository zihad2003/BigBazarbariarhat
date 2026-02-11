import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { UserRole } from '@bigbazar/shared';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('q') || searchParams.get('search');
        const role = searchParams.get('role') as UserRole | undefined;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        let query = supabaseAdmin
            .from('users')
            .select('*', { count: 'exact' });

        if (search) {
            query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
        }

        if (role) {
            query = query.eq('role', role);
        }

        query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

        const { data, count, error } = await query as any;

        if (error) {
            console.error('Customers query error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: data || [],
            total: count || 0,
            page,
            limit,
        });
    } catch (error) {
        console.error('Customers API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch entities' }, { status: 500 });
    }
}
