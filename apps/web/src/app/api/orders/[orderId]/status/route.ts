import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import type { OrderRecord } from '@/lib/db';

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
        const updated = await db.orders.updateStatus(orderId, status as OrderRecord['status']);
        if (!updated) {
            return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: updated });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to update order status.' }, { status: 500 });
    }
}
