export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { getCache, setCache, invalidateCachePattern } from '@/lib/cache';
import { checkAdminAuth } from '@/lib/auth-utils';
import { checkSteadfastCustomer } from '@/lib/steadfast';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) return authCheck.response;

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

        // Calculate trust stats by customerPhone
        let customerStats: any = null;
        const lookupPhone = order.customerPhone || shipping?.phone;
        
        if (lookupPhone) {
            const customerOrders = await prisma.order.findMany({
                where: {
                    OR: [
                        { customerPhone: lookupPhone },
                        ...(order.userId ? [{ userId: order.userId }] : [])
                    ]
                },
                select: {
                    status: true,
                    totalAmount: true
                }
            });

            const total = customerOrders.length;
            const delivered = customerOrders.filter(o => o.status === 'DELIVERED').length;
            const cancelled = customerOrders.filter(o => o.status === 'CANCELLED').length;
            const totalSpent = customerOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
            const deliveryRate = total > 0 ? (delivered / total) * 100 : 0;

            let score = 0;
            let tier = 'New customer — no history';
            let tierColor = 'gray';

            if (total >= 2) {
                score = Math.round((delivered / total) * 100);
                if (score >= 80) {
                    tier = 'Trusted';
                    tierColor = 'green';
                } else if (score >= 50) {
                    tier = 'Moderate risk';
                    tierColor = 'yellow';
                } else {
                    tier = 'High risk';
                    tierColor = 'red';
                }
            }

            const partnerStats = await checkSteadfastCustomer(lookupPhone);

            customerStats = {
                totalOrders: total,
                deliveredOrders: delivered,
                cancelledOrders: cancelled,
                totalSpent,
                deliveryRate: Math.round(deliveryRate),
                trustScore: score,
                trustTier: tier,
                trustTierColor: tierColor,
                deliveryPartnerStats: partnerStats
            };
        }

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
            shippingAddress: null, // Trigger guestAddress rendering in UI
            adminNotes: order.adminNote || '', // Map database adminNote -> adminNotes
            customerStats
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
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) return authCheck.response;

        const { id } = await params;
        const body = await req.json();
        const { status, paymentStatus, adminNotes, adminNote } = body;

        const noteToSave = adminNotes !== undefined ? adminNotes : (adminNote !== undefined ? adminNote : undefined);

        // If changing status to CANCELLED, restore stock first
        if (status === 'CANCELLED') {
            const currentOrder = await prisma.order.findUnique({
                where: { id },
                include: { items: true }
            });

            if (currentOrder && currentOrder.status !== 'CANCELLED') {
                // Restore stock for each order item
                for (const item of currentOrder.items) {
                    await prisma.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                increment: item.quantity,
                            },
                        },
                    });
                }
            }
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: status || undefined,
                paymentStatus: paymentStatus || undefined,
                adminNote: noteToSave !== undefined ? noteToSave : undefined,
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

        // Calculate trust stats by customerPhone
        let customerStats: any = null;
        const lookupPhone = updatedOrder.customerPhone || shipping?.phone;
        
        if (lookupPhone) {
            const customerOrders = await prisma.order.findMany({
                where: {
                    OR: [
                        { customerPhone: lookupPhone },
                        ...(updatedOrder.userId ? [{ userId: updatedOrder.userId }] : [])
                    ]
                },
                select: {
                    status: true,
                    totalAmount: true
                }
            });

            const total = customerOrders.length;
            const delivered = customerOrders.filter(o => o.status === 'DELIVERED').length;
            const cancelled = customerOrders.filter(o => o.status === 'CANCELLED').length;
            const totalSpent = customerOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
            const deliveryRate = total > 0 ? (delivered / total) * 100 : 0;

            let score = 0;
            let tier = 'New customer — no history';
            let tierColor = 'gray';

            if (total >= 2) {
                score = Math.round((delivered / total) * 100);
                if (score >= 80) {
                    tier = 'Trusted';
                    tierColor = 'green';
                } else if (score >= 50) {
                    tier = 'Moderate risk';
                    tierColor = 'yellow';
                } else {
                    tier = 'High risk';
                    tierColor = 'red';
                }
            }

            const partnerStats = await checkSteadfastCustomer(lookupPhone);

            customerStats = {
                totalOrders: total,
                deliveredOrders: delivered,
                cancelledOrders: cancelled,
                totalSpent,
                deliveryRate: Math.round(deliveryRate),
                trustScore: score,
                trustTier: tier,
                trustTierColor: tierColor,
                deliveryPartnerStats: partnerStats
            };
        }

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
            shippingAddress: null,
            adminNotes: updatedOrder.adminNote || '', // Map database adminNote -> adminNotes
            customerStats
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

