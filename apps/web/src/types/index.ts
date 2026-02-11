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

// ==================== PRODUCT TYPES ====================

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    icon?: string;
    parentId?: string;
    displayOrder: number;
    isActive: boolean;
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    description?: string;
    isActive: boolean;
}

export interface ProductImage {
    id: string;
    productId: string;
    url: string;
    altText?: string;
    displayOrder: number;
    isPrimary: boolean;
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
    viewCount: number;
    averageRating?: number;
    reviewCount?: number;
    createdAt: Date;
    updatedAt: Date;
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
}

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

// ==================== API TYPES ====================

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
