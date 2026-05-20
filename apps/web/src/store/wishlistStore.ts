import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  slug: string;
}

// Accepts either a WishlistItem or a raw Product-like object
type WishlistInput = WishlistItem | {
  id: string;
  name: string;
  basePrice?: number;
  salePrice?: number;
  price?: number;
  images?: Array<{ url: string } | string> | null;
  category?: { name: string } | string;
  slug?: string;
};

function toWishlistItem(input: WishlistInput): WishlistItem {
  if ('productId' in input) return input as WishlistItem;

  const p = input as any;
  const firstImage = p.images?.[0];
  const image =
    typeof firstImage === 'string'
      ? firstImage
      : firstImage?.url ?? '';

  const categoryName =
    typeof p.category === 'object' ? p.category?.name : p.category ?? '';

  return {
    id: p.id,
    productId: p.id,
    name: p.name,
    price: p.salePrice ?? p.basePrice ?? p.price ?? 0,
    image,
    category: categoryName,
    slug: p.slug ?? p.id,
  };
}

interface WishlistState {
  items: WishlistItem[];

  // Actions
  addItem: (item: WishlistInput) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistInput) => void;
  clearWishlist: () => void;

  // Computed — both naming conventions supported
  isWishlisted: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (input) => {
        const item = toWishlistItem(input);
        const { items } = get();
        if (!items.find((i) => i.productId === item.productId)) {
          set({ items: [...items, item] });
          toast.success('Added to wishlist ❤️');
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
        toast.info('Removed from wishlist.');
      },

      toggleItem: (input) => {
        const item = toWishlistItem(input);
        const { items, addItem, removeItem } = get();
        if (items.find((i) => i.productId === item.productId)) {
          removeItem(item.productId);
        } else {
          addItem(item);
        }
      },

      clearWishlist: () => set({ items: [] }),

      isWishlisted: (productId) => get().items.some((i) => i.productId === productId),
      isInWishlist: (productId) => get().items.some((i) => i.productId === productId),

      getItemCount: () => get().items.length,
    }),
    {
      name: 'bigbazar-wishlist-v2',
    }
  )
);
