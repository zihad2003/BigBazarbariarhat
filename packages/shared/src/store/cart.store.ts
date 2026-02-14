import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant } from '../types/product.types';

type CouponType = 'percent' | 'flat' | 'shipping';

interface CouponRule {
    code: string;
    type: CouponType;
    value: number;
    minSubtotal: number;
}

const COUPON_RULES: CouponRule[] = [
    { code: 'WELCOME10', type: 'percent', value: 10, minSubtotal: 500 },
    { code: 'SAVE200', type: 'flat', value: 200, minSubtotal: 1500 },
    { code: 'FREESHIP', type: 'shipping', value: 0, minSubtotal: 1000 },
];

const FREE_SHIPPING_THRESHOLD = 2000;
const BASE_SHIPPING_COST = 80;

const normalizeCode = (code: string) => code.trim().toUpperCase();
const findCoupon = (code?: string | null) =>
    COUPON_RULES.find((coupon) => coupon.code === normalizeCode(code || ''));

export interface CartItem {
    id: string; // unique ID for cart item
    productId: string;
    variantId?: string;
    quantity: number;
    product: Product;
    variant?: ProductVariant;
}

interface CartState {
    items: CartItem[];
    savedItems: CartItem[];
    couponCode: string | null;
    addItem: (product: Product, quantity: number, variant?: ProductVariant) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    saveForLater: (itemId: string) => void;
    moveToCart: (itemId: string) => void;
    removeSavedItem: (itemId: string) => void;
    clearCart: () => void;
    applyCoupon: (code: string) => { success: boolean; message: string };
    removeCoupon: () => void;
    getSubtotal: () => number;
    getDiscountAmount: () => number;
    getShippingCost: () => number;
    getTotal: () => number;
    getTotalItems: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            savedItems: [],
            couponCode: null,
            addItem: (product, quantity, variant) => {
                const currentItems = get().items;
                const existingItem = currentItems.find(
                    item => item.productId === product.id && item.variantId === variant?.id
                );

                if (existingItem) {
                    set({
                        items: currentItems.map(item =>
                            item.id === existingItem.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...currentItems,
                            {
                                id: `${product.id}-${variant?.id || 'base'}-${Date.now()}`,
                                productId: product.id,
                                variantId: variant?.id,
                                quantity,
                                product,
                                variant,
                            },
                        ],
                    });
                }
            },
            removeItem: (itemId) => {
                set({ items: get().items.filter(item => item.id !== itemId) });
            },
            updateQuantity: (itemId, quantity) => {
                if (quantity <= 0) {
                    const newItems = get().items.filter(item => item.id !== itemId);
                    set({ items: newItems });
                    return;
                }
                set({
                    items: get().items.map(item =>
                        item.id === itemId ? { ...item, quantity } : item
                    ),
                });
            },
            saveForLater: (itemId) => {
                const { items, savedItems } = get();
                const item = items.find((entry) => entry.id === itemId);

                if (!item) {
                    return;
                }

                const existingSaved = savedItems.find(
                    (saved) => saved.productId === item.productId && saved.variantId === item.variantId
                );

                const nextSavedItems = existingSaved
                    ? savedItems.map((saved) =>
                        saved.id === existingSaved.id
                            ? { ...saved, quantity: saved.quantity + item.quantity }
                            : saved
                    )
                    : [...savedItems, item];

                set({
                    items: items.filter((entry) => entry.id !== itemId),
                    savedItems: nextSavedItems,
                });
            },
            moveToCart: (itemId) => {
                const { items, savedItems } = get();
                const savedItem = savedItems.find((entry) => entry.id === itemId);

                if (!savedItem) {
                    return;
                }

                const existingItem = items.find(
                    (entry) => entry.productId === savedItem.productId && entry.variantId === savedItem.variantId
                );

                const nextItems = existingItem
                    ? items.map((entry) =>
                        entry.id === existingItem.id
                            ? { ...entry, quantity: entry.quantity + savedItem.quantity }
                            : entry
                    )
                    : [
                        ...items,
                        {
                            ...savedItem,
                            id: `${savedItem.productId}-${savedItem.variantId || 'base'}-${Date.now()}`,
                        },
                    ];

                set({
                    items: nextItems,
                    savedItems: savedItems.filter((entry) => entry.id !== itemId),
                });
            },
            removeSavedItem: (itemId) => {
                set({ savedItems: get().savedItems.filter((item) => item.id !== itemId) });
            },
            clearCart: () => set({ items: [], couponCode: null }),
            applyCoupon: (code) => {
                const normalized = normalizeCode(code);

                if (!normalized) {
                    return { success: false, message: 'Please enter a coupon code.' };
                }

                const coupon = findCoupon(normalized);

                if (!coupon) {
                    return { success: false, message: 'That coupon code is not valid.' };
                }

                const subtotal = get().getSubtotal();

                if (subtotal < coupon.minSubtotal) {
                    return {
                        success: false,
                        message: `Spend ৳${coupon.minSubtotal.toLocaleString()} to use this code.`,
                    };
                }

                set({ couponCode: normalized });

                return {
                    success: true,
                    message: coupon.type === 'shipping'
                        ? 'Free shipping applied.'
                        : `${coupon.code} applied successfully.`,
                };
            },
            removeCoupon: () => {
                set({ couponCode: null });
            },
            getSubtotal: () => {
                return get().items.reduce((total, item) => {
                    const price = item.variant
                        ? (item.product.salePrice ?? item.product.basePrice) + item.variant.priceAdjustment
                        : (item.product.salePrice ?? item.product.basePrice);
                    return total + price * item.quantity;
                }, 0);
            },
            getDiscountAmount: () => {
                const { couponCode } = get();
                const subtotal = get().getSubtotal();
                const coupon = findCoupon(couponCode);

                if (!coupon || subtotal < coupon.minSubtotal) {
                    return 0;
                }

                if (coupon.type === 'percent') {
                    return Math.round((subtotal * coupon.value) / 100);
                }

                if (coupon.type === 'flat') {
                    return Math.min(coupon.value, subtotal);
                }

                return 0;
            },
            getShippingCost: () => {
                const subtotal = get().getSubtotal();
                const coupon = findCoupon(get().couponCode);

                if (coupon?.type === 'shipping' && subtotal >= coupon.minSubtotal) {
                    return 0;
                }

                return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_COST;
            },
            getTotal: () => {
                const subtotal = get().getSubtotal();
                const discount = get().getDiscountAmount();
                const shipping = get().getShippingCost();
                return Math.max(subtotal - discount, 0) + shipping;
            },
            getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
            getItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({
                items: state.items,
                savedItems: state.savedItems,
                couponCode: state.couponCode,
            }),
        }
    )
);
