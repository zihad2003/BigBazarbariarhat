import { Product, ProductVariant } from './product.types';
import { User, Address } from './user.types';

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

export interface OrderFilters {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    startDate?: Date;
    endDate?: Date;
    customerId?: string;
}

export interface CreateOrderItemInput {
    productId: string;
    variantId?: string;
    quantity: number;
}

export interface CreateOrderInput {
    shippingAddressId?: string;
    guestAddress?: Partial<Address>;
    guestEmail?: string;
    guestPhone?: string;
    guestName?: string;
    paymentMethod: PaymentMethod;
    shippingMethod?: string;
    couponCode?: string;
    customerNotes?: string;
    items: CreateOrderItemInput[];
}

export interface UpdateOrderStatusInput {
    status: OrderStatus;
    paymentStatus?: PaymentStatus;
    trackingNumber?: string;
    adminNotes?: string;
    estimatedDelivery?: Date | string;
}
