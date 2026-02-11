// ==================== USER TYPES ====================

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'STAFF';

export interface User {
    id: string;
    email: string;
    phone?: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    avatar?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Address {
    id: string;
    userId: string;
    label: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ==================== PRODUCT TYPES ====================

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    icon?: string;
    parentId?: string;
    parent?: Category;
    children?: Category[];
    displayOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    categoryId: string;
    category?: Category;
    brandId?: string;
    brand?: Brand;
    sku: string;
    barcode?: string;
    basePrice: number;
    salePrice?: number;
    costPrice?: number;
    stockQuantity: number;
    lowStockThreshold: number;
    isActive: boolean;
    isFeatured: boolean;
    isNewArrival: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    images?: ProductImage[];
    variants?: ProductVariant[];
    reviews?: Review[];
    attributes?: ProductAttribute[];
    viewCount: number;
    averageRating?: number;
    reviewCount?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductImage {
    id: string;
    productId: string;
    url: string;
    altText?: string;
    displayOrder: number;
    isPrimary: boolean;
    createdAt: Date;
}

export interface ProductVariant {
    id: string;
    productId: string;
    name: string;
    sku: string;
    size?: string;
    color?: string;
    colorHex?: string;
    material?: string;
    priceAdjustment?: number;
    stockQuantity: number;
    images: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type AttributeDisplayType = 'SELECT' | 'RADIO' | 'CHECKBOX' | 'COLOR';

export interface AttributeKey {
    id: string;
    name: string;
    slug: string;
    displayType: AttributeDisplayType;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductAttribute {
    id: string;
    productId: string;
    keyId: string;
    key?: AttributeKey;
    value: string;
}

// ==================== CART TYPES ====================

export interface CartItem {
    id: string;
    userId?: string;
    sessionId?: string;
    productId: string;
    product?: Product;
    variantId?: string;
    variant?: ProductVariant;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Cart {
    items: CartItem[];
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    taxAmount: number;
    total: number;
    couponCode?: string;
}

// ==================== WISHLIST TYPES ====================

export interface WishlistItem {
    id: string;
    userId: string;
    productId: string;
    product?: Product;
    createdAt: Date;
}

// ==================== ORDER TYPES ====================

export type OrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED';

export type PaymentStatus =
    | 'PENDING'
    | 'PAID'
    | 'FAILED'
    | 'REFUNDED'
    | 'PARTIALLY_REFUNDED';

export type PaymentMethod =
    | 'CASH_ON_DELIVERY'
    | 'BKASH'
    | 'NAGAD'
    | 'ROCKET'
    | 'CREDIT_CARD'
    | 'DEBIT_CARD'
    | 'BANK_TRANSFER'
    | 'STRIPE'
    | 'PAYPAL'
    | 'SSL_COMMERZ';

export interface Order {
    id: string;
    orderNumber: string;
    userId?: string;
    user?: User;
    guestEmail?: string;
    guestPhone?: string;
    guestName?: string;
    shippingAddressId?: string;
    shippingAddress?: Address;
    guestAddress?: Address;
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    taxAmount: number;
    totalAmount: number;
    couponCode?: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod?: PaymentMethod;
    shippingMethod?: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    deliveredAt?: Date;
    items: OrderItem[];
    customerNotes?: string;
    adminNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    product?: Product;
    variantId?: string;
    variant?: ProductVariant;
    productName: string;
    variantName?: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    createdAt: Date;
}

// ==================== REVIEW TYPES ====================

export interface Review {
    id: string;
    productId: string;
    product?: Product;
    userId: string;
    user?: User;
    rating: number;
    title?: string;
    comment?: string;
    images: string[];
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    helpfulCount: number;
    createdAt: Date;
    updatedAt: Date;
}

// ==================== COUPON TYPES ====================

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';

export interface Coupon {
    id: string;
    code: string;
    description?: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    applicableToCategories: string[];
    applicableToProducts: string[];
    usageLimit?: number;
    usagePerUser?: number;
    currentUsage: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ==================== BANNER TYPES ====================

export type BannerPosition =
    | 'HOME_HERO'
    | 'HOME_SECONDARY'
    | 'CATEGORY_TOP'
    | 'PRODUCT_SIDEBAR'
    | 'CHECKOUT_TOP';

export interface Banner {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    imageDesktop: string;
    imageMobile?: string;
    linkUrl?: string;
    linkText?: string;
    position: BannerPosition;
    displayOrder: number;
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// ==================== SHIPPING TYPES ====================

export interface ShippingZone {
    id: string;
    name: string;
    description?: string;
    cities: string[];
    postalCodes: string[];
    rates?: ShippingRate[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ShippingRate {
    id: string;
    zoneId: string;
    zone?: ShippingZone;
    name: string;
    description?: string;
    baseRate: number;
    minOrderAmount?: number;
    maxOrderAmount?: number;
    freeShippingThreshold?: number;
    estimatedDays?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ==================== SETTINGS TYPES ====================

export interface SiteSetting {
    id: string;
    key: string;
    value: unknown;
    description?: string;
    updatedAt: Date;
}

export interface SiteSettings {
    siteName: string;
    siteLogo: string;
    favicon: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    socialLinks: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        youtube?: string;
        whatsapp?: string;
    };
    currency: {
        code: string;
        symbol: string;
        symbolPosition: 'before' | 'after';
    };
    taxRate: number;
    taxEnabled: boolean;
}

// ==================== ANALYTICS TYPES ====================

export interface ActivityLog {
    id: string;
    userId?: string;
    userEmail?: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: unknown;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}

export interface DashboardStats {
    totalSales: {
        today: number;
        thisMonth: number;
        allTime: number;
    };
    totalOrders: {
        pending: number;
        processing: number;
        shipped: number;
        delivered: number;
        cancelled: number;
        total: number;
    };
    totalCustomers: number;
    totalProducts: number;
    lowStockItems: number;
    pendingReviews: number;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// ==================== FILTER TYPES ====================

export interface ProductFilters {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    colors?: string[];
    materials?: string[];
    inStock?: boolean;
    rating?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating' | 'name_asc' | 'name_desc';
}

export interface OrderFilters {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    startDate?: Date;
    endDate?: Date;
    customerId?: string;
}

// ==================== SEARCH TYPES ====================

export interface SearchResult {
    products: Product[];
    categories: Category[];
    brands: Brand[];
    totalResults: number;
}

export interface SearchSuggestion {
    type: 'product' | 'category' | 'brand' | 'keyword';
    text: string;
    slug?: string;
    image?: string;
}
