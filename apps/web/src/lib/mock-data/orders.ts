import { Product, ProductVariant } from '@bigbazar/shared';
import { MOCK_PRODUCTS } from './products';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: string;
    productId: string;
    variantId?: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

export interface Order {
    id: string;
    date: string;
    status: OrderStatus;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        upazila: string;
        district: string;
        division: string;
    };
    paymentMethod: string;
    timeline: {
        status: OrderStatus | 'placed' | 'confirmed' | 'out_for_delivery';
        date: string;
        time: string;
        completed: boolean;
    }[];
}

export const MOCK_ORDERS: Order[] = [
    {
        id: 'BBB-827192',
        date: '2026-04-28',
        status: 'delivered',
        subtotal: 4500,
        shippingCost: 0,
        discount: 450,
        total: 4050,
        paymentMethod: 'bKash',
        shippingAddress: {
            fullName: 'Zihad Islam',
            phone: '01712345678',
            address: 'House 12, Road 5, Block B',
            upazila: 'Mirpur-10',
            district: 'Dhaka',
            division: 'Dhaka'
        },
        items: [
            {
                id: '1',
                productId: MOCK_PRODUCTS[0].id,
                name: MOCK_PRODUCTS[0].name,
                quantity: 1,
                price: 1200,
                image: MOCK_PRODUCTS[0].images[0].url
            },
            {
                id: '2',
                productId: MOCK_PRODUCTS[1].id,
                name: MOCK_PRODUCTS[1].name,
                quantity: 2,
                price: 1650,
                image: MOCK_PRODUCTS[1].images[0].url
            }
        ],
        timeline: [
            { status: 'placed', date: '2026-04-28', time: '10:30 AM', completed: true },
            { status: 'pending', date: '2026-04-28', time: '11:15 AM', completed: true },
            { status: 'processing', date: '2026-04-29', time: '09:00 AM', completed: true },
            { status: 'shipped', date: '2026-04-30', time: '02:30 PM', completed: true },
            { status: 'delivered', date: '2026-05-01', time: '12:45 PM', completed: true }
        ]
    },
    {
        id: 'BBB-901234',
        date: '2026-05-01',
        status: 'shipped',
        subtotal: 1200,
        shippingCost: 60,
        discount: 0,
        total: 1260,
        paymentMethod: 'Cash on Delivery',
        shippingAddress: {
            fullName: 'Zihad Islam',
            phone: '01712345678',
            address: 'Sector 7, Uttara',
            upazila: 'Uttara',
            district: 'Dhaka',
            division: 'Dhaka'
        },
        items: [
            {
                id: '3',
                productId: MOCK_PRODUCTS[2].id,
                name: MOCK_PRODUCTS[2].name,
                quantity: 1,
                price: 1200,
                image: MOCK_PRODUCTS[2].images[0].url
            }
        ],
        timeline: [
            { status: 'placed', date: '2026-05-01', time: '03:20 PM', completed: true },
            { status: 'pending', date: '2026-05-01', time: '04:00 PM', completed: true },
            { status: 'processing', date: '2026-05-01', time: '06:30 PM', completed: true },
            { status: 'shipped', date: '2026-05-02', time: '10:00 AM', completed: true },
            { status: 'delivered', date: '', time: '', completed: false }
        ]
    },
    {
        id: 'BBB-112233',
        date: '2026-05-02',
        status: 'pending',
        subtotal: 800,
        shippingCost: 60,
        discount: 0,
        total: 860,
        paymentMethod: 'Nagad',
        shippingAddress: {
            fullName: 'Zihad Islam',
            phone: '01712345678',
            address: 'Agrabad, CGS Colony',
            upazila: 'Double Mooring',
            district: 'Chittagong',
            division: 'Chittagong'
        },
        items: [
            {
                id: '4',
                productId: MOCK_PRODUCTS[3].id,
                name: MOCK_PRODUCTS[3].name,
                quantity: 1,
                price: 800,
                image: MOCK_PRODUCTS[3].images[0].url
            }
        ],
        timeline: [
            { status: 'placed', date: '2026-05-02', time: '11:00 AM', completed: true },
            { status: 'pending', date: '', time: '', completed: false },
            { status: 'processing', date: '', time: '', completed: false },
            { status: 'shipped', date: '', time: '', completed: false },
            { status: 'delivered', date: '', time: '', completed: false }
        ]
    }
];
