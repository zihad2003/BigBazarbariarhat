'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image: string;
    category?: string;
    slug: string;
}

interface WishlistState {
    items: WishlistItem[];
    
    // Actions
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    toggleItem: (item: WishlistItem) => void;
    isWishlisted: (id: string) => boolean;
    clearWishlist: () => void;
    
    // Computed
    getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const { items } = get();
                if (!items.find(i => i.id === item.id)) {
                    set({ items: [...items, item] });
                    toast.success('Artifact reserved in collection ❤️');
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter(i => i.id !== id) });
                toast.info('Artifact released from collection.');
            },

            toggleItem: (item) => {
                const { items, addItem, removeItem } = get();
                if (items.find(i => i.id === item.id)) {
                    removeItem(item.id);
                } else {
                    addItem(item);
                }
            },

            isWishlisted: (id) => {
                return get().items.some(i => i.id === id);
            },

            clearWishlist: () => set({ items: [] }),

            getItemCount: () => {
                return get().items.length;
            }
        }),
        {
            name: 'bigbazar-wishlist-v2',
        }
    )
);
