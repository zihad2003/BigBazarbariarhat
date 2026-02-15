import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateOrderStatusSchema } from '@bigbazar/validation';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // @ts-ignore
        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        image: true,
                    }
                },
                shippingAddress: true,
                items: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                images: { where: { isPrimary: true }, take: 1 }
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        console.error('Admin Order Detail API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch order details' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const json = await request.json();
        const body = updateOrderStatusSchema.parse(json);
        const { status, paymentStatus, trackingNumber, adminNotes, estimatedDelivery } = body;

        // @ts-ignore
        const order = await prisma.order.update({
            where: { id: params.id },
            data: {
                status: status,
                paymentStatus: paymentStatus,
                trackingNumber,
                adminNotes,
                estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
                deliveredAt: status === 'DELIVERED' ? new Date() : undefined
            }
        });

        // Trigger email notification service here if status changes
        // e.g. EmailService.sendOrderUpdate(order);

        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        console.error('Admin Order Update API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // @ts-ignore
        await prisma.order.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true, message: 'Order archived/deleted successfully' });
    } catch (error) {
        console.error('Admin Order Delete API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete order' }, { status: 500 });
    }
}
