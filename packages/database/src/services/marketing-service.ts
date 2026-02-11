import { prisma } from '../client';
import { DiscountType } from '@bigbazar/shared';

export const MarketingService = {
    async getCoupons(query?: string) {
        return prisma.coupon.findMany({
            where: query ? {
                OR: [
                    { code: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ]
            } : {},
            orderBy: { createdAt: 'desc' }
        });
    },

    async createCoupon(data: any) {
        return prisma.coupon.create({
            data: {
                code: data.code,
                description: data.description,
                discountType: data.discountType as any,
                discountValue: parseFloat(data.discountValue),
                minOrderAmount: data.minOrderAmount ? parseFloat(data.minOrderAmount) : null,
                maxDiscountAmount: data.maxDiscountAmount ? parseFloat(data.maxDiscountAmount) : null,
                usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
                usagePerUser: data.usagePerUser ? parseInt(data.usagePerUser) : null,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                isActive: data.isActive ?? true
            }
        });
    },

    async deleteCoupon(id: string) {
        return prisma.coupon.delete({
            where: { id }
        });
    }
};
