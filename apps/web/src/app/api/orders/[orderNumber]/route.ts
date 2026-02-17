import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    try {
        const { userId } = await auth();
        const user = await currentUser();
        const { orderNumber } = await params;
        const isAdmin = user?.publicMetadata?.role === 'admin';

        const { data: order, error } = await supabaseAdmin
            .from('orders')
            .select(`
                *,
                items:order_items(
                    *,
                    product:products(name, slug, images, base_price, sale_price)
                )
            `)
            .eq('order_number', orderNumber)
            .single() as any;

        if (error || !order) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        // Security: If the order has a userId, only the owner can see it (unless admin)
        if (order.user_id && order.user_id !== userId && !isAdmin) {
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
