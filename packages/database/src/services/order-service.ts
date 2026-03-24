import { prisma } from '../client';
import { Prisma } from '@prisma/client';

export const OrderService = {
    async list(filters: any) {
        const { search, status, page = 1, limit = 10, userId } = filters;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { orderNumber: { contains: search } },
                { guestName: { contains: search } },
                { guestPhone: { contains: search } },
            ];
        }

        if (status) {
            where.status = status;
        }

        if (userId) {
            where.customerId = userId;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    customer: true,
                    items: {
                        include: {
                            product: {
                                include: {
                                    images: true
                                }
                            },
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            } as any),
            prisma.order.count({ where }),
        ]);

        return {
            data: orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async getById(id: string) {
        return prisma.order.findUnique({
            where: { id },
            include: {
                customer: true,
                items: {
                    include: {
                        product: {
                            include: {
                                brand: true,
                                category: true,
                                images: true
                            }
                        },
                    }
                }
            }
        } as any);
    },

    async create(data: any) {
        const {
            items,
            guestEmail,
            guestPhone,
            guestName,
            guestAddress,
            guestArea,
            paymentMethod,
            totalAmount,
            deliveryFee = 60,
            discount = 0,
            note,
            userId,
            isUrgent = false
        } = data;

        // Generate order number
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
        const count = await prisma.order.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0,0,0,0)),
                }
            }
        });
        const orderNumber = `BB-${dateStr}-${String(count + 1).padStart(4, '0')}`;

        return prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    orderNumber,
                    customerId: userId || null,
                    guestName,
                    guestEmail,
                    guestPhone,
                    guestAddress,
                    guestArea,
                    paymentMethod: paymentMethod as any,
                    status: 'PENDING' as any,
                    paymentStatus: 'UNPAID' as any,
                    totalAmount: new Prisma.Decimal(totalAmount),
                    deliveryFee: new Prisma.Decimal(deliveryFee),
                    discount: new Prisma.Decimal(discount),
                    note,
                    isUrgent,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            variantId: item.variantId,
                            quantity: item.quantity,
                            unitPrice: new Prisma.Decimal(item.price),
                            subtotal: new Prisma.Decimal(item.price * item.quantity),
                        }))
                    }
                }
            } as any);

            // Update inventory
            for (const item of items) {
                if (item.variantId) {
                    await tx.productVariant.update({
                        where: { id: item.variantId },
                        data: {
                            stock: {
                                decrement: item.quantity
                            }
                        }
                    } as any);
                }
            }

            return order;
        });
    },

    async updateStatus(id: string, data: any) {
        return prisma.order.update({
            where: { id },
            data: {
                status: data.status,
                paymentStatus: data.paymentStatus,
                bkashTrxId: data.bkashTrxId,
                nagadTrxId: data.nagadTrxId,
                note: data.note
            }
        } as any);
    }
};
