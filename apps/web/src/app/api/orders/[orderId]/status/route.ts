export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@bigbazar/db';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const { orderId } = await params;
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
        return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }

    try {
        const { status } = await req.json();
        
        // Ensure status is valid
        const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        const upperStatus = status.toUpperCase();
        if (!validStatuses.includes(upperStatus)) {
            return NextResponse.json({ success: false, message: 'Invalid order status value.' }, { status: 400 });
        }

        const updated = await prisma.order.update({
            where: { id: orderId },
            data: { status: upperStatus as any }
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error('Order Status PUT Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to update order status.' }, { status: 500 });
    }
}
