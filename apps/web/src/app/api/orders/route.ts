import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs';

export async function POST(request: NextRequest) {
    try {
        const { userId } = auth();
        const body = await request.json();

        const {
            items,
            shippingAddressId,
            guestAddress,
            guestEmail,
            guestPhone,
            guestName,
            paymentMethod,
            subtotal,
            shippingCost,
            taxAmount,
            discountAmount,
            totalAmount,
            couponCode
        } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, error: 'No items in order' }, { status: 400 });
        }

        // Generate Order Number
        const orderNumber = `BB-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

        // Create the order in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // 1. Create Order
            const newOrder = await tx.order.create({
                data: {
                    orderNumber,
                    userId: userId || null,
                    guestEmail: !userId ? guestEmail : null,
                    guestPhone: !userId ? guestPhone : null,
                    guestName: !userId ? guestName : null,
                    shippingAddressId,
                    subtotal,
                    shippingCost,
                    taxAmount,
                    discountAmount,
                    totalAmount,
                    couponCode,
                    status: 'PENDING',
                    paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID', // Simplified for now
                    paymentMethod,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            variantId: item.variantId,
                            productName: item.name,
                            variantName: item.variantName,
                            sku: item.sku,
                            quantity: item.quantity,
                            unitPrice: item.price,
                            totalPrice: item.price * item.quantity,
                        })),
                    },
                },
            });

            // 2. Decrement stock
            for (const item of items) {
                if (item.variantId) {
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: { stockQuantity: { decrement: item.quantity } }
                    });
                } else {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stockQuantity: { decrement: item.quantity } }
                    });
                }
            }

            return newOrder;
        });

        return NextResponse.json({
            success: true,
            data: order,
            message: 'Order placed successfully!'
        });
    } catch (error) {
        console.error('Create Order Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to place order' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Fetch Orders Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
    }
}
