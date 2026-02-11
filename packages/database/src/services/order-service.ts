import { prisma } from '../client';
import { OrderFilters, CreateOrderInput, UpdateOrderStatusInput } from '@bigbazar/shared';

// Define Filters locally or import if available. OrderFilters is in shared.
// Wait, shared depends on database? No, database usually depends on nothing (or prisma).
// Shared depends on database? No.
// Usually:
// Apps -> Shared (Types/API Clients)
// Apps -> Database (Prisma Client/Services)
// Shared -> Types (Self-contained)
// Database -> Prisma

// If I import from @bigbazar/shared here, I create a circular dependency if shared depends on database (for types?).
// @bigbazar/shared types are pure TS interfaces. So it's safe for database to import types from shared IF shared doesn't import database.
// Shared imports nothing from database.
// So Database -> Shared is fine.

export const OrderService = {
    async list(filters: any) { // Type 'any' for now or define custom filter type compatible with Prisma
        const { search, status, page = 1, limit = 10, userId } = filters;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { guestName: { contains: search, mode: 'insensitive' } },
                // { user: { firstName: { contains: search, mode: 'insensitive' } } },
                // { user: { lastName: { contains: search, mode: 'insensitive' } } }
                // Searching relations in Prisma requires specific structure, for simpler logic I'll stick to direct fields or use exact relation query
            ];
            // To search in relation:
            // where.user = { is: { OR: [...] } }
        }

        if (status) {
            where.status = status;
        }

        if (userId) {
            where.userId = userId;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: { select: { firstName: true, lastName: true, email: true } },
                    _count: { select: { items: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.order.count({ where })
        ]);

        return {
            data: orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    async getById(id: string) {
        return prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true
                    }
                },
                user: true,
                shippingAddress: true,
                guestAddress: true
            }
        });
    },

    async create(data: any) {
        // This would be complex transactional logic
        // For now, let's keep it simple or implement if requested.
        // The user asked for "shared API services for Orders and Payments" - which I interpreted as the API Client wrappers in 'shared'.
        // But implementing the backend logic in 'database' is good practice.
        // I'll leave create empty or basic for now as the current task is Admin Migration (Viewing Orders).
        throw new Error('Not implemented');
    },

    async updateStatus(id: string, data: UpdateOrderStatusInput) {
        return prisma.order.update({
            where: { id },
            data: {
                status: data.status,
                paymentStatus: data.paymentStatus,
                trackingNumber: data.trackingNumber,
                adminNotes: data.adminNotes,
                estimatedDelivery: data.estimatedDelivery
            }
        });
    }
};
