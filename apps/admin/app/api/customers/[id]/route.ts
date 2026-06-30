import { NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { getCache, setCache, invalidateCachePattern } from '@/lib/cache';
import { checkAdminAuth } from '@/lib/auth-utils';
import { checkSteadfastCustomer } from '@/lib/steadfast';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) return authCheck.response;

        const { id } = await params;
        const cacheKey = `customers-detail-${id}`;
        const cachedData = getCache<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json({ success: true, data: cachedData });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                reviews: {
                    include: { product: true },
                    orderBy: { createdAt: 'desc' }
                },
                _count: {
                    select: { orders: true }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
        }

        // Calculate Stats using both userId and phone (for guest order linkage)
        const orderWhereClause: any = {
            OR: [
                { userId: id }
            ]
        };
        if (user.phone) {
            orderWhereClause.OR.push({ customerPhone: user.phone });
        }

        const allCustomerOrders = await prisma.order.findMany({
            where: orderWhereClause,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                orderNumber: true,
                status: true,
                totalAmount: true,
                createdAt: true
            }
        });

        const totalOrders = allCustomerOrders.length;
        const deliveredOrders = allCustomerOrders.filter(o => o.status === 'DELIVERED').length;
        const cancelledOrders = allCustomerOrders.filter(o => o.status === 'CANCELLED').length;
        const totalSpent = allCustomerOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
        const lastOrder = totalOrders > 0 ? allCustomerOrders[0] : null;

        const deliveryRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;
        const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

        let tier = 'New customer — no history';
        let tierColor = 'gray';
        let score = 0;

        if (totalOrders >= 2) {
            score = Math.round((deliveredOrders / totalOrders) * 100);
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

        const partnerStats = user.phone ? await checkSteadfastCustomer(user.phone) : null;

        const responseData = {
            ...user,
            stats: {
                totalSpent,
                orderCount: totalOrders,
                averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
                deliveredOrders,
                cancelledOrders,
                deliveryRate: Math.round(deliveryRate),
                cancellationRate: Math.round(cancellationRate),
                trustScore: score,
                trustTier: tier,
                trustTierColor: tierColor,
                lastOrderDate: lastOrder ? lastOrder.createdAt : null,
                deliveryPartnerStats: partnerStats
            },
            // For UI compatibility, providing empty addresses as placeholder if not in schema
            addresses: [] 
        };

        setCache(cacheKey, responseData, 10 * 1000); // Cache for 10 seconds

        return NextResponse.json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch customer' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) return authCheck.response;

        const { id } = await params;
        const body = await req.json();
        
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
            }
        });

        // Invalidate customer-related caches
        invalidateCachePattern('customers-');
        invalidateCachePattern('dashboard-stats');

        return NextResponse.json({ success: true, data: updatedUser });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update customer' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) return authCheck.response;

        const { id } = await params;

        // Check if the customer exists
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
        }

        // Check if customer has orders — prevent deletion to preserve order history
        const orderCount = await prisma.order.count({ where: { userId: id } });
        if (orderCount > 0) {
            return NextResponse.json({
                success: false,
                error: `Cannot delete this customer because they have ${orderCount} order(s). Remove their orders first or deactivate the account instead.`
            }, { status: 409 });
        }

        // Delete reviews first (foreign key constraint)
        await prisma.review.deleteMany({ where: { userId: id } });

        // Safe to delete the user
        await prisma.user.delete({ where: { id } });

        // Invalidate customer-related caches
        invalidateCachePattern('customers-');
        invalidateCachePattern('dashboard-stats');

        return NextResponse.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Customer DELETE Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete customer' }, { status: 500 });
    }
}
