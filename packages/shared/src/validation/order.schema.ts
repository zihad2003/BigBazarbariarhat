import { z } from 'zod';
import { addressSchema } from './user.schema';

export const orderStatusSchema = z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
]);

export const paymentStatusSchema = z.enum([
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED',
    'PARTIALLY_REFUNDED',
]);

export const paymentMethodSchema = z.enum([
    'CASH_ON_DELIVERY',
    'BKASH',
    'NAGAD',
    'ROCKET',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'BANK_TRANSFER',
    'STRIPE',
    'PAYPAL',
    'SSL_COMMERZ',
]);

export const addToCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    variantId: z.string().optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1').default(1),
});

export const updateCartItemSchema = z.object({
    quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
    shippingAddressId: z.string().optional(),
    guestAddress: addressSchema.optional(),
    guestEmail: z.string().email().optional(),
    guestPhone: z.string().optional(),
    guestName: z.string().optional(),
    paymentMethod: paymentMethodSchema,
    shippingMethod: z.string().optional(),
    couponCode: z.string().optional(),
    customerNotes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
    status: orderStatusSchema,
    paymentStatus: paymentStatusSchema.optional(),
    trackingNumber: z.string().optional(),
    adminNotes: z.string().optional(),
    estimatedDelivery: z.string().or(z.date()).optional(),
});

export const createCouponSchema = z.object({
    code: z.string().min(1, 'Coupon code is required').toUpperCase(),
    description: z.string().optional(),
    discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']),
    discountValue: z.number().min(0, 'Discount value must be positive'),
    minOrderAmount: z.number().min(0).optional(),
    maxDiscountAmount: z.number().min(0).optional(),
    applicableToCategories: z.array(z.string()).default([]),
    applicableToProducts: z.array(z.string()).default([]),
    usageLimit: z.number().min(1).optional(),
    usagePerUser: z.number().min(1).optional(),
    startDate: z.date(),
    endDate: z.date(),
    isActive: z.boolean().default(true),
});
