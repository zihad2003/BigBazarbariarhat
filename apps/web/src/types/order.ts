export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variant?: string;
}

export interface DeliveryAddress {
    fullName: string;
    phone: string;
    email?: string;
    division: string;
    district: string;
    upazila?: string;
    address: string;
}

export interface OrderTimeline {
    status: OrderStatus;
    date: string;
    time: string;
    completed: boolean;
    note?: string;
}

export interface Order {
    id: string; // Format: BBB-YYYYMMDD-XXXX
    userId: string;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
    couponCode?: string;
    status: OrderStatus;
    paymentMethod: 'COD' | 'bKash' | 'Nagad' | 'Card';
    paymentStatus: 'pending' | 'paid' | 'failed';
    deliveryAddress: DeliveryAddress;
    timeline: OrderTimeline[];
    internalNotes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderResponse {
    orders: Order[];
    total: number;
    page: number;
    totalPages: number;
}
