import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(
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
        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
        }
        if (order.userId !== session.user.id && (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Access denied.' }, { status: 403 });
        }
        return NextResponse.json({ success: true, data: order });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to fetch order.' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params;
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }

    try {
        const { status } = await req.json();
        const updated = await db.orders.updateStatus(orderId, status);
        if (!updated) {
            return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: updated });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to update order.' }, { status: 500 });
    }
}
