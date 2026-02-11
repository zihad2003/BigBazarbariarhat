import { prisma } from '../client';
import { Customer, UserFilters } from '@bigbazar/shared';

export const CustomerService = {
    async list(filters: UserFilters & { page?: number; limit?: number }) {
        const { search, role, isActive, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (role) {
            where.role = role;
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                include: {
                    _count: {
                        select: { orders: true }
                    },
                    orders: {
                        select: { totalAmount: true },
                        where: {
                            status: {
                                notIn: ['CANCELLED', 'REFUNDED']
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.user.count({ where })
        ]);

        const customers: Customer[] = users.map((user: any) => {
            const totalSpent = user.orders.reduce((sum: number, order: any) => sum + Number(order.totalAmount), 0);
            const { orders, ...rest } = user;

            return {
                ...rest,
                role: user.role,
                orderCount: user._count.orders,
                totalSpent
            } as Customer;
        });

        return {
            data: customers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    async getById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                addresses: true,
                orders: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        items: true
                    }
                },
                _count: {
                    select: { orders: true }
                }
            }
        });

        if (!user) return null;

        const aggregate = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { userId: id, status: { notIn: ['CANCELLED', 'REFUNDED'] } }
        });

        return {
            ...user,
            totalSpent: Number(aggregate._sum.totalAmount || 0),
            orderCount: user._count.orders
        };
    }
};
