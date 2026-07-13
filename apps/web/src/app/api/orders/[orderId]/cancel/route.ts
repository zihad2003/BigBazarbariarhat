import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@bigbazar/db';

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
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });

        if (!order || order.userId !== session.user.id) {
            return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
        }

        if (order.status !== 'PENDING') {
            return NextResponse.json({ success: false, message: 'Only pending orders can be cancelled.' }, { status: 400 });
        }

        // Restore stock for each order item
        for (const item of order.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        increment: item.quantity,
                    },
                },
            });
        }

        const cancelled = await prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' }
        });

        return NextResponse.json({ success: true, data: cancelled });
    } catch (error) {
        console.error('Order Cancel Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to cancel order.' }, { status: 500 });
    }
}
