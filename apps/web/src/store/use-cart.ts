import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, ProductVariant } from '@bigbazar/shared';

export interface CartItemState {
    id: string; // Unique ID for cart entry (e.g. productId + variantId)
    productId: string;
    product: Product;
    variantId?: string;
    variant?: ProductVariant;
    quantity: number;
}

interface CartStore {
    items: CartItemState[];
    addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
    removeItem: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;

    // Computed values logic can be done in components or selectors, 
    // but basic getters here are helpful
    getTotalItems: () => number;
    getSubtotal: () => number;
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, quantity = 1, variant) => {
                const currentItems = get().items;
                const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;

                const existingItem = currentItems.find(item => item.id === cartItemId);

                if (existingItem) {
                    set({
                        items: currentItems.map(item =>
                            item.id === cartItemId
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...currentItems,
                            {
                                id: cartItemId,
                                productId: product.id,
                                product,
                                variantId: variant?.id,
                                variant,
                                quantity,
                            },
                        ],
                    });
                }
            },

            removeItem: (cartItemId) => {
                set({
                    items: get().items.filter(item => item.id !== cartItemId),
                });
            },

            updateQuantity: (cartItemId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(cartItemId);
                    return;
                }
                set({
                    items: get().items.map(item =>
                        item.id === cartItemId ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce((total, item) => {
                    const price = item.variant?.priceAdjustment
                        ? (item.product.salePrice || item.product.basePrice) + item.variant.priceAdjustment
                        : (item.product.salePrice || item.product.basePrice);
                    return total + price * item.quantity;
                }, 0);
            },
        }),
        {
            name: 'bigbazar-cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
