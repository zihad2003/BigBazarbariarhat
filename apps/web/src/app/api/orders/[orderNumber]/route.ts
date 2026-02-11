import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs';

export async function GET(
    request: NextRequest,
    { params }: { params: { orderNumber: string } }
) {
    try {
        const { userId } = auth();
        const { orderNumber } = params;

        const order = await prisma.order.findUnique({
            where: { orderNumber },
            include: {
                items: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        // Security: If the order has a userId, only the owner can see it
        // Except for guest orders which use guestEmail check (or orderNumber knowledge as authentication)
        if (order.userId && order.userId !== userId) {
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
