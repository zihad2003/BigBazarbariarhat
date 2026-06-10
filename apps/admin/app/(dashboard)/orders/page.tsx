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
            { orderNumber: { startsWith: q } },
            { customerPhone: { startsWith: q } },
            {
                user: {
                    OR: [
                        { name: { startsWith: q } },
                        { email: { startsWith: q } }
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

    return (
        <OrdersTableClient
            initialOrders={orders}
            pagination={pagination}
        />
    );
}
