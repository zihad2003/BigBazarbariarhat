'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variant?: string;
    stock: number;
}

interface CartState {
    items: CartItem[];
    savedItems: CartItem[];
    couponCode: string | null;
    discount: number;
    
    // Actions
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    applyCoupon: (code: string) => { success: boolean, message: string };
    saveForLater: (id: string) => void;
    moveToCart: (id: string) => void;
    removeSavedItem: (id: string) => void;
    
    // Computed / Helper Methods
    getSubtotal: () => number;
    getTotal: () => number;
    getItemCount: () => number;
    getDiscountAmount: () => number;
    getShippingCost: () => number;
    removeCoupon: () => void;
}

const MOCK_COUPONS: Record<string, number> = {
    'BIGBAZAR10': 0.1, // 10% off
    'SAVE50': 50,      // ৳50 off
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            savedItems: [],
            couponCode: null,
            discount: 0,

            addItem: (newItem) => {
                const { items } = get();
                const existingItem = items.find(i => i.productId === newItem.productId && i.variant === newItem.variant);

                if (existingItem) {
                    const updatedQuantity = existingItem.quantity + newItem.quantity;
                    if (updatedQuantity > existingItem.stock) {
                        toast.error('Manifest capacity reached for this artifact.');
                        return;
                    }
                    set({
                        items: items.map(i => i.id === existingItem.id ? { ...i, quantity: updatedQuantity } : i)
                    });
                } else {
                    const id = `${newItem.productId}-${newItem.variant || 'base'}-${Date.now()}`;
                    set({ items: [...items, { ...newItem, id }] });
                }

                toast.success('Artifact synchronized with curation.', {
                    action: {
                        label: 'Undo',
                        onClick: () => get().removeItem(existingItem?.id || `${newItem.productId}-${newItem.variant || 'base'}`)
                    }
                });
            },

            removeItem: (id) => {
                set({ items: get().items.filter(i => i.id !== id) });
                toast.info('Artifact removed from curation matrix.');
            },

            updateQuantity: (id, quantity) => {
                const item = get().items.find(i => i.id === id);
                if (!item) return;

                if (quantity > item.stock) {
                    toast.error('Insufficient stock in the repository.');
                    return;
                }

                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }

                set({
                    items: get().items.map(i => i.id === id ? { ...i, quantity } : i)
                });
            },

            clearCart: () => {
                set({ items: [], couponCode: null, discount: 0 });
            },

            applyCoupon: (code) => {
                const discountValue = MOCK_COUPONS[code.toUpperCase()];
                if (discountValue !== undefined) {
                    set({ couponCode: code.toUpperCase(), discount: discountValue });
                    const message = 'Authorization code accepted. Credit applied.';
                    toast.success(message);
                    return { success: true, message };
                } else {
                    const message = 'Invalid authorization code.';
                    toast.error(message);
                    return { success: false, message };
                }
            },

            saveForLater: (id) => {
                const item = get().items.find(i => i.id === id);
                if (item) {
                    set({
                        items: get().items.filter(i => i.id !== id),
                        savedItems: [...get().savedItems, item]
                    });
                    toast.success('Artifact archived for later synchronization.');
                }
            },

            moveToCart: (id) => {
                const item = get().savedItems.find(i => i.id === id);
                if (item) {
                    set({
                        savedItems: get().savedItems.filter(i => i.id !== id),
                        items: [...get().items, item]
                    });
                    toast.success('Artifact restored to curation matrix.');
                }
            },

            removeSavedItem: (id) => {
                set({ savedItems: get().savedItems.filter(i => i.id !== id) });
                toast.info('Archived artifact purged.');
            },

            removeCoupon: () => {
                set({ couponCode: null, discount: 0 });
            },

            getSubtotal: () => {
                return get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            },

            getDiscountAmount: () => {
                const sub = get().getSubtotal();
                const disc = get().discount;
                if (disc > 0 && disc < 1) {
                    return sub * disc;
                }
                return disc;
            },

            getShippingCost: () => {
                return get().getSubtotal() > 1000 ? 0 : 60;
            },

            getTotal: () => {
                const sub = get().getSubtotal();
                const discAmount = get().getDiscountAmount();
                const shipping = get().getShippingCost();
                
                return Math.max(0, sub - discAmount + shipping);
            },

            getItemCount: () => {
                return get().items.reduce((acc, item) => acc + item.quantity, 0);
            }
        }),
        {
            name: 'bigbazar-cart-v2',
        }
    )
);
