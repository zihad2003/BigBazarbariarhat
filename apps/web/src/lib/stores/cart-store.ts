import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductVariant } from '@/types';

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    couponCode: string | null;

    // Actions
    addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    applyCoupon: (code: string) => void;
    removeCoupon: () => void;

    // Computed
    getSubtotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            couponCode: null,

            addItem: (product, quantity = 1, variant) => {
                const { items } = get();
                const existingIndex = items.findIndex(
                    (item) =>
                        item.productId === product.id &&
                        item.variantId === (variant?.id || null)
                );

                if (existingIndex > -1) {
                    // Update existing item quantity
                    const newItems = [...items];
                    newItems[existingIndex].quantity += quantity;
                    set({ items: newItems });
                } else {
                    // Add new item
                    const newItem: CartItem = {
                        id: `${product.id}-${variant?.id || 'default'}-${Date.now()}`,
                        productId: product.id,
                        product,
                        variantId: variant?.id,
                        variant,
                        quantity,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    set({ items: [...items, newItem] });
                }
            },

            removeItem: (itemId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== itemId),
                }));
            },

            updateQuantity: (itemId, quantity) => {
                if (quantity < 1) {
                    get().removeItem(itemId);
                    return;
                }

                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === itemId
                            ? { ...item, quantity, updatedAt: new Date() }
                            : item
                    ),
                }));
            },

            clearCart: () => {
                set({ items: [], couponCode: null });
            },

            toggleCart: () => {
                set((state) => ({ isOpen: !state.isOpen }));
            },

            openCart: () => {
                set({ isOpen: true });
            },

            closeCart: () => {
                set({ isOpen: false });
            },

            applyCoupon: (code) => {
                set({ couponCode: code.toUpperCase() });
            },

            removeCoupon: () => {
                set({ couponCode: null });
            },

            getSubtotal: () => {
                const { items } = get();
                return items.reduce((total, item) => {
                    const price = item.product?.salePrice || item.product?.basePrice || 0;
                    const adjustment = item.variant?.priceAdjustment || 0;
                    return total + (price + adjustment) * item.quantity;
                }, 0);
            },

            getItemCount: () => {
                const { items } = get();
                return items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({
                items: state.items,
                couponCode: state.couponCode,
            }),
        }
    )
);
