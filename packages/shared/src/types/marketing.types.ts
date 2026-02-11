export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';

export interface Coupon {
    id: string;
    code: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    startDate: Date;
    endDate: Date;
    usageLimit?: number;
    currentUsage: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCouponInput {
    code: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount?: number;
    startDate: Date | string;
    endDate: Date | string;
    usageLimit?: number;
}
