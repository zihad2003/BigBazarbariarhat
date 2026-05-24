import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { getCache, setCache, invalidateCachePattern } from '@/lib/cache';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cacheKey = `orders-detail-${id}`;
        const cachedData = getCache<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json({ success: true, data: cachedData });
        }

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: true } }
            }
        });

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        let shipping: any = {};
        try {
            shipping = typeof order.shippingAddress === 'string'
                ? JSON.parse(order.shippingAddress)
                : order.shippingAddress;
        } catch (e) {}

        const itemsMapped = order.items.map((item: any) => {
            let productImages: any[] = [];
            try {
                productImages = typeof item.product.images === 'string'
                    ? JSON.parse(item.product.images)
                    : (Array.isArray(item.product.images) ? item.product.images : []);
            } catch (e) {}

            return {
                id: item.id,
                productName: item.product.name,
                sku: item.product.sku,
                variantName: null,
                totalPrice: Number(item.price) * item.quantity,
                unitPrice: Number(item.price),
                quantity: item.quantity,
                product: {
                    images: productImages
                }
            };
        });

        const subtotal = itemsMapped.reduce((acc, item) => acc + item.totalPrice, 0);
        const totalAmountNum = Number(order.totalAmount);
        const shippingCost = totalAmountNum > subtotal ? (totalAmountNum - subtotal) : 0;
        const discountAmount = totalAmountNum < subtotal ? (subtotal - totalAmountNum) : 0;

        const guestAddress = shipping?.address 
            ? `${shipping.address}, ${shipping.upazila || ''}, ${shipping.district || ''}, ${shipping.division || ''}`
            : 'N/A';

        const mappedOrder = {
            ...order,
            items: itemsMapped,
            subtotal,
            discountAmount,
            shippingCost,
            totalAmount: totalAmountNum,
            guestName: shipping?.fullName || order.user?.name || 'Guest Customer',
            guestEmail: shipping?.email || order.user?.email || 'guest@bigbazar.com',
            guestPhone: shipping?.phone || 'N/A',
            guestAddress: guestAddress,
            shippingAddress: null // Trigger guestAddress rendering in UI
        };

        setCache(cacheKey, mappedOrder, 10 * 1000); // Cache for 10 seconds

        return NextResponse.json({ success: true, data: mappedOrder });
    } catch (error) {
        console.error('Fetch Order Detail Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch order detail' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { status, paymentStatus } = body;

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: status || undefined,
                paymentStatus: paymentStatus || undefined,
            },
            include: {
                user: { select: { name: true, email: true } },
                items: { include: { product: true } }
            }
        });

        let shipping: any = {};
        try {
            shipping = typeof updatedOrder.shippingAddress === 'string'
                ? JSON.parse(updatedOrder.shippingAddress)
                : updatedOrder.shippingAddress;
        } catch (e) {}

        const itemsMapped = updatedOrder.items.map((item: any) => {
            let productImages: any[] = [];
            try {
                productImages = typeof item.product.images === 'string'
                    ? JSON.parse(item.product.images)
                    : (Array.isArray(item.product.images) ? item.product.images : []);
            } catch (e) {}

            return {
                id: item.id,
                productName: item.product.name,
                sku: item.product.sku,
                variantName: null,
                totalPrice: Number(item.price) * item.quantity,
                unitPrice: Number(item.price),
                quantity: item.quantity,
                product: {
                    images: productImages
                }
            };
        });

        const subtotal = itemsMapped.reduce((acc, item) => acc + item.totalPrice, 0);
        const totalAmountNum = Number(updatedOrder.totalAmount);
        const shippingCost = totalAmountNum > subtotal ? (totalAmountNum - subtotal) : 0;
        const discountAmount = totalAmountNum < subtotal ? (subtotal - totalAmountNum) : 0;

        const guestAddress = shipping?.address 
            ? `${shipping.address}, ${shipping.upazila || ''}, ${shipping.district || ''}, ${shipping.division || ''}`
            : 'N/A';

        const mappedOrder = {
            ...updatedOrder,
            items: itemsMapped,
            subtotal,
            discountAmount,
            shippingCost,
            totalAmount: totalAmountNum,
            guestName: shipping?.fullName || updatedOrder.user?.name || 'Guest Customer',
            guestEmail: shipping?.email || updatedOrder.user?.email || 'guest@bigbazar.com',
            guestPhone: shipping?.phone || 'N/A',
            guestAddress: guestAddress,
            shippingAddress: null
        };

        // Invalidate order related caches, analytics, and dashboard-stats
        invalidateCachePattern('orders-');
        invalidateCachePattern('analytics-');
        invalidateCachePattern('dashboard-stats');

        return NextResponse.json({ success: true, data: mappedOrder });
    } catch (error) {
        console.error('Update Order Detail Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to update order detail' }, { status: 500 });
    }
}
