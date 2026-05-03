import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function POST(
    _req: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: 'Login required.' }, { status: 401 });
    }

    try {
        const order = await db.orders.findById(orderId);
        if (!order || order.userId !== session.user.id) {
            return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
        }
        if (order.status !== 'pending') {
            return NextResponse.json({ success: false, message: 'Only pending orders can be cancelled.' }, { status: 400 });
        }
        const cancelled = await db.orders.cancel(orderId);
        return NextResponse.json({ success: true, data: cancelled });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to cancel order.' }, { status: 500 });
    }
}
