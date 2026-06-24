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
    couponType: string | null;
    
    // Actions
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    applyCoupon: (code: string) => Promise<{ success: boolean, message: string }>;
    saveForLater: (id: string) => void;
    moveToCart: (id: string) => void;
    removeSavedItem: (id: string) => void;
    
    // Accepts a full Product-shaped object (from API) and maps it to CartItem
    addProduct: (product: {
        id: string;
        name: string;
        basePrice: number;
        salePrice?: number | null;
        images?: Array<{ url: string } | string> | null;
        stock?: number;
        slug?: string;
    }, quantity?: number, variantLabel?: string) => void;

    // Computed / Helper Methods
    getSubtotal: () => number;
    getTotal: () => number;
    getItemCount: () => number;
    getDiscountAmount: () => number;
    getShippingCost: () => number;
    removeCoupon: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            savedItems: [],
            couponCode: null,
            discount: 0,
            couponType: null,

            addItem: (newItem) => {
                const { items } = get();
                const existingItem = items.find(i => i.productId === newItem.productId && i.variant === newItem.variant);

                if (existingItem) {
                    const updatedQuantity = existingItem.quantity + newItem.quantity;
                    if (updatedQuantity > existingItem.stock) {
                        toast.error('Maximum available stock reached for this product.');
                        return;
                    }
                    set({
                        items: items.map(i => i.id === existingItem.id ? { ...i, quantity: updatedQuantity } : i)
                    });
                } else {
                    const id = `${newItem.productId}-${newItem.variant || 'base'}-${Date.now()}`;
                    set({ items: [...items, { ...newItem, id }] });
                }

                toast.success(`${newItem.name.toUpperCase()} ADDED TO CART`, {
                    action: {
                        label: 'Undo',
                        onClick: () => get().removeItem(existingItem?.id || `${newItem.productId}-${newItem.variant || 'base'}-${Date.now()}`)
                    }
                });
            },

            removeItem: (id) => {
                const item = get().items.find(i => i.id === id);
                set({ items: get().items.filter(i => i.id !== id) });
                toast.info(`${item ? item.name.toUpperCase() : 'Product'} removed from cart.`);
            },

            updateQuantity: (id, quantity) => {
                const item = get().items.find(i => i.id === id);
                if (!item) return;

                if (quantity > item.stock) {
                    toast.error('Insufficient stock available.');
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
                set({ items: [], couponCode: null, discount: 0, couponType: null });
            },

            applyCoupon: async (code) => {
                try {
                    const response = await fetch('/api/coupons/validate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            code,
                            cartTotal: get().getSubtotal(),
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok || !data.valid) {
                        const message = data.message || 'Invalid promo code.';
                        toast.error(message);
                        return { success: false, message };
                    }

                    const { discountType, discountValue, message } = data;
                    let localDiscount = 0;
                    if (discountType === 'PERCENTAGE') {
                        localDiscount = Number(discountValue) / 100;
                    } else if (discountType === 'FIXED_AMOUNT') {
                        localDiscount = Number(discountValue);
                    }

                    set({
                        couponCode: code.toUpperCase(),
                        discount: localDiscount,
                        couponType: discountType,
                    });

                    const successMessage = message || 'Promo code accepted! discount applied.';
                    toast.success(successMessage);
                    return { success: true, message: successMessage };
                } catch (error) {
                    console.error('Apply Coupon Error:', error);
                    const message = 'Failed to apply coupon.';
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
                    toast.success('Product saved for later.');
                }
            },

            moveToCart: (id) => {
                const item = get().savedItems.find(i => i.id === id);
                if (item) {
                    set({
                        savedItems: get().savedItems.filter(i => i.id !== id),
                        items: [...get().items, item]
                    });
                    toast.success('Product moved back to cart.');
                }
            },

            removeSavedItem: (id) => {
                set({ savedItems: get().savedItems.filter(i => i.id !== id) });
                toast.info('Item removed from saved list.');
            },

            removeCoupon: () => {
                set({ couponCode: null, discount: 0, couponType: null });
            },

            addProduct: (product, quantity = 1, variantLabel) => {
                const firstImage = product.images?.[0];
                const image = typeof firstImage === 'string' ? firstImage : firstImage?.url ?? '';
                get().addItem({
                    productId: product.id,
                    name: product.name,
                    price: product.salePrice ?? product.basePrice,
                    image,
                    quantity,
                    variant: variantLabel,
                    stock: product.stock ?? 99,
                });
            },

            getSubtotal: () => {
                return get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            },

            getDiscountAmount: () => {
                const sub = get().getSubtotal();
                const disc = get().discount;
                if (get().couponType === 'PERCENTAGE') {
                    return sub * disc;
                }
                return disc;
            },

            getShippingCost: () => {
                if (get().couponType === 'FREE_SHIPPING') return 0;
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
