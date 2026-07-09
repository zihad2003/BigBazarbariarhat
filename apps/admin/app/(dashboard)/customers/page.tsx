export const dynamic = 'force-dynamic';

import { prisma } from '@bigbazar/db';
import CustomersTableClient from './customers-table-client';

interface CustomersPageProps {
    searchParams: Promise<{
        page?: string;
        q?: string;
    }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
    const resolvedParams = await searchParams;
    const page = parseInt(resolvedParams.page || '1');
    const q = resolvedParams.q || '';
    const limit = 10;
    const skip = (page - 1) * limit;

    // Fetch users with role USER matching query
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where: {
                role: 'USER',
                OR: [
                    { name: { startsWith: q } },
                    { email: { startsWith: q } },
                    { phone: { startsWith: q } }
                ]
            },
            include: {
                _count: {
                    select: { orders: true }
                },
                orders: {
                    select: { totalAmount: true }
                }
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({
            where: {
                role: 'USER',
                OR: [
                    { name: { startsWith: q } },
                    { email: { startsWith: q } },
                    { phone: { startsWith: q } }
                ]
            }
        })
    ]);

    // Format customers with order Count and total Spent
    const formattedCustomers = users.map(user => {
        const totalSpent = user.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        return {
            id: user.id,
            name: user.name || 'Anonymous',
            email: user.email,
            phone: user.phone || '',
            orderCount: user._count.orders,
            totalSpent: totalSpent,
            createdAt: user.createdAt
        };
    });

    const totalPages = Math.ceil(total / limit);

    const pagination = {
        page,
        limit,
        total,
        totalPages
    };

    return (
        <CustomersTableClient
            initialCustomers={formattedCustomers}
            pagination={pagination}
        />
    );
}
