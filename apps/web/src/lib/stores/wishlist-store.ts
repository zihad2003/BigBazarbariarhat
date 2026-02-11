import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WishlistItem, Product } from '@/types';

interface WishlistState {
    items: WishlistItem[];

    // Actions
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    toggleItem: (product: Product) => void;
    clearWishlist: () => void;

    // Computed
    isInWishlist: (productId: string) => boolean;
    getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product) => {
                const { items } = get();
                const exists = items.some((item) => item.productId === product.id);

                if (!exists) {
                    const newItem: WishlistItem = {
                        id: `wishlist-${product.id}-${Date.now()}`,
                        userId: '', // Will be set when user is logged in
                        productId: product.id,
                        product,
                        createdAt: new Date(),
                    };
                    set({ items: [...items, newItem] });
                }
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.productId !== productId),
                }));
            },

            toggleItem: (product) => {
                const { items, addItem, removeItem } = get();
                const exists = items.some((item) => item.productId === product.id);

                if (exists) {
                    removeItem(product.id);
                } else {
                    addItem(product);
                }
            },

            clearWishlist: () => {
                set({ items: [] });
            },

            isInWishlist: (productId) => {
                const { items } = get();
                return items.some((item) => item.productId === productId);
            },

            getItemCount: () => {
                return get().items.length;
            },
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
