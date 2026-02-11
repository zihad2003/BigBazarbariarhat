import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant } from '../types/product.types';

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
    addItem: (product: Product, quantity: number, variant?: ProductVariant) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getSubtotal: () => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
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
                                variant
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
            clearCart: () => set({ items: [] }),
            getSubtotal: () => {
                return get().items.reduce((total, item) => {
                    const price = item.variant
                        ? (item.product.salePrice ?? item.product.basePrice) + item.variant.priceAdjustment
                        : (item.product.salePrice ?? item.product.basePrice);
                    return total + price * item.quantity;
                }, 0);
            },
            getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
        }),
        {
            name: 'cart-storage',
            // storage defaults to localStorage. Mobile needs configuration.
        }
    )
);
