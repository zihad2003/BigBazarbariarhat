import { z } from 'zod';

// ==================== USER SCHEMAS ====================

export const userRoleSchema = z.enum(['CUSTOMER', 'ADMIN', 'SUPER_ADMIN', 'STAFF']);

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().optional(),
    avatar: z.string().url().optional(),
});

// ==================== ADDRESS SCHEMAS ====================

export const addressSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    fullName: z.string().min(1, 'Full name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    addressLine1: z.string().min(1, 'Address is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().default('Bangladesh'),
    isDefault: z.boolean().default(false),
});

// ==================== PRODUCT SCHEMAS ====================

export const productFilterSchema = z.object({
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.number().min(0).optional(),
    maxPrice: z.number().min(0).optional(),
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    inStock: z.boolean().optional(),
    sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'popular', 'rating']).optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
});

export const createProductSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().optional(),
    shortDescription: z.string().optional(),
    categoryId: z.string().min(1, 'Category is required'),
    brandId: z.string().optional(),
    sku: z.string().min(1, 'SKU is required'),
    barcode: z.string().optional(),
    basePrice: z.number().min(0, 'Price must be positive'),
    salePrice: z.number().min(0).optional(),
    costPrice: z.number().min(0).optional(),
    stockQuantity: z.number().min(0).default(0),
    lowStockThreshold: z.number().min(0).default(10),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    isNewArrival: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
});

export const productVariantSchema = z.object({
    name: z.string().min(1, 'Variant name is required'),
    sku: z.string().min(1, 'SKU is required'),
    size: z.string().optional(),
    color: z.string().optional(),
    colorHex: z.string().optional(),
    material: z.string().optional(),
    priceAdjustment: z.number().optional(),
    stockQuantity: z.number().min(0).default(0),
    images: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
});

// ==================== CART SCHEMAS ====================

export const addToCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    variantId: z.string().optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1').default(1),
});

export const updateCartItemSchema = z.object({
    quantity: z.number().min(1, 'Quantity must be at least 1'),
});

// ==================== ORDER SCHEMAS ====================

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

// ==================== REVIEW SCHEMAS ====================

export const createReviewSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
    title: z.string().optional(),
    comment: z.string().optional(),
    images: z.array(z.string()).default([]),
});

// ==================== COUPON SCHEMAS ====================

export const discountTypeSchema = z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']);

export const createCouponSchema = z.object({
    code: z.string().min(1, 'Coupon code is required').toUpperCase(),
    description: z.string().optional(),
    discountType: discountTypeSchema,
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

export const applyCouponSchema = z.object({
    code: z.string().min(1, 'Coupon code is required'),
});

// ==================== CATEGORY SCHEMAS ====================

export const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().optional(),
    image: z.string().url().optional(),
    icon: z.string().optional(),
    parentId: z.string().optional(),
    displayOrder: z.number().default(0),
    isActive: z.boolean().default(true),
});

// ==================== BRAND SCHEMAS ====================

export const createBrandSchema = z.object({
    name: z.string().min(1, 'Brand name is required'),
    slug: z.string().min(1, 'Slug is required'),
    logo: z.string().url().optional(),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
});

// ==================== BANNER SCHEMAS ====================

export const bannerPositionSchema = z.enum([
    'HOME_HERO',
    'HOME_SECONDARY',
    'CATEGORY_TOP',
    'PRODUCT_SIDEBAR',
    'CHECKOUT_TOP',
]);

export const createBannerSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    imageDesktop: z.string().url('Invalid desktop image URL'),
    imageMobile: z.string().url().optional(),
    linkUrl: z.string().url().optional(),
    linkText: z.string().optional(),
    position: bannerPositionSchema.default('HOME_HERO'),
    displayOrder: z.number().default(0),
    isActive: z.boolean().default(true),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
});

// ==================== SHIPPING SCHEMAS ====================

export const createShippingZoneSchema = z.object({
    name: z.string().min(1, 'Zone name is required'),
    description: z.string().optional(),
    cities: z.array(z.string()).default([]),
    postalCodes: z.array(z.string()).default([]),
    isActive: z.boolean().default(true),
});

export const createShippingRateSchema = z.object({
    zoneId: z.string().min(1, 'Zone ID is required'),
    name: z.string().min(1, 'Rate name is required'),
    description: z.string().optional(),
    baseRate: z.number().min(0, 'Base rate must be positive'),
    minOrderAmount: z.number().min(0).optional(),
    maxOrderAmount: z.number().min(0).optional(),
    freeShippingThreshold: z.number().min(0).optional(),
    estimatedDays: z.string().optional(),
    isActive: z.boolean().default(true),
});

// ==================== SEARCH SCHEMA ====================

export const searchSchema = z.object({
    q: z.string().min(1, 'Search query is required'),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
});

// ==================== PAGINATION SCHEMA ====================

export const paginationSchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
});

// ==================== CONTACT FORM SCHEMA ====================

export const contactFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

// ==================== NEWSLETTER SCHEMA ====================

export const newsletterSchema = z.object({
    email: z.string().email('Invalid email address'),
});

// Export types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type CreateBannerInput = z.infer<typeof createBannerSchema>;
export type CreateShippingZoneInput = z.infer<typeof createShippingZoneSchema>;
export type CreateShippingRateInput = z.infer<typeof createShippingRateSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
