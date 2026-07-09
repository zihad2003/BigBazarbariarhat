export const dynamic = 'force-dynamic';

import { prisma } from '@bigbazar/db';
import OrdersTableClient from './orders-table-client';

interface OrdersPageProps {
    searchParams: Promise<{
        page?: string;
        q?: string;
    }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
    const resolvedParams = await searchParams;
    const page = parseInt(resolvedParams.page || '1');
    const q = resolvedParams.q || '';
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build Prisma query filter
    const whereClause: any = {};

    if (q) {
        // Support searching by order number, phone number, customer name or email
        whereClause.OR = [
            { orderNumber: { contains: q } },
            { customerPhone: { contains: q } },
            {
                user: {
                    OR: [
                        { name: { contains: q } },
                        { email: { contains: q } }
                    ]
                }
            }
        ];
    }

    // Fetch orders and total count concurrently
    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where: whereClause,
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.order.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(total / limit);

    const pagination = {
        page,
        limit,
        total,
        totalPages
    };

    // Map Prisma objects to plain serializable objects
    // (Decimal and Date types can't be serialized by React Server Components)
    const serializedOrders = orders.map((order: any) => {
        let shipping: any = {};
        try {
            shipping = typeof order.shippingAddress === 'string'
                ? JSON.parse(order.shippingAddress)
                : order.shippingAddress;
        } catch (e) {}

        return {
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            totalAmount: Number(order.totalAmount),
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            customerPhone: order.customerPhone,
            createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
            updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : order.updatedAt,
            userName: order.user?.name || shipping?.fullName || 'Guest',
            userEmail: order.user?.email || shipping?.email || '',
        };
    });

    return (
        <OrdersTableClient
            initialOrders={serializedOrders}
            pagination={pagination}
        />
    );
}
