import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    try {
        const { userId } = await auth();
        const { orderNumber } = await params;

        const { data: order, error } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('order_number', orderNumber)
            .single() as any;

        if (error || !order) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        // Security: If the order has a userId, only the owner can see it
        if (order.user_id && order.user_id !== userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized access to order' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Fetch Order Detail Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
