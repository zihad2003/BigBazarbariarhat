import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '@/lib/stores/cart-store';

/**
 * Unit tests for the Cart Store.
 * Tests core cart operations: add, remove, update quantity, clear.
 */
describe('Cart Store', () => {
    beforeEach(() => {
        // Reset store state between tests
        const { result } = renderHook(() => useCartStore());
        act(() => {
            result.current.clearCart();
        });
    });

    const mockProduct = {
        id: 'prod-1',
        name: 'Test Product',
        slug: 'test-product',
        description: 'A test product',
        basePrice: 999,
        salePrice: undefined,
        inventoryCount: 50,
        stockQuantity: 50,
        sku: 'TST-001',
        images: [{ id: '1', url: '/test.jpg', isPrimary: true }],
        categoryId: 'cat-1',
        isActive: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    } as any;

    it('should initialize with empty cart', () => {
        const { result } = renderHook(() => useCartStore());
        expect(result.current.items).toHaveLength(0);
        expect(result.current.getItemCount()).toBe(0);
        expect(result.current.getSubtotal()).toBe(0);
    });

    it('should add an item to the cart', () => {
        const { result } = renderHook(() => useCartStore());

        act(() => {
            result.current.addItem(mockProduct, 1);
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.getItemCount()).toBe(1);
    });

    it('should increase quantity when adding same product twice', () => {
        const { result } = renderHook(() => useCartStore());

        act(() => {
            result.current.addItem(mockProduct, 1);
            result.current.addItem(mockProduct, 2);
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].quantity).toBe(3);
    });

    it('should remove an item from the cart', () => {
        const { result } = renderHook(() => useCartStore());

        act(() => {
            result.current.addItem(mockProduct, 1);
        });

        const itemId = result.current.items[0].id;

        act(() => {
            result.current.removeItem(itemId);
        });

        expect(result.current.items).toHaveLength(0);
    });

    it('should update item quantity', () => {
        const { result } = renderHook(() => useCartStore());

        act(() => {
            result.current.addItem(mockProduct, 1);
        });

        const itemId = result.current.items[0].id;

        act(() => {
            result.current.updateQuantity(itemId, 5);
        });

        expect(result.current.items[0].quantity).toBe(5);
    });

    it('should clear all items', () => {
        const { result } = renderHook(() => useCartStore());

        act(() => {
            result.current.addItem(mockProduct, 1);
            result.current.addItem({ ...mockProduct, id: 'prod-2' } as any, 2);
        });

        expect(result.current.items).toHaveLength(2);

        act(() => {
            result.current.clearCart();
        });

        expect(result.current.items).toHaveLength(0);
        expect(result.current.getSubtotal()).toBe(0);
    });

    it('should toggle cart open/close', () => {
        const { result } = renderHook(() => useCartStore());

        expect(result.current.isOpen).toBe(false);

        act(() => {
            result.current.openCart();
        });
        expect(result.current.isOpen).toBe(true);

        act(() => {
            result.current.closeCart();
        });
        expect(result.current.isOpen).toBe(false);

        act(() => {
            result.current.toggleCart();
        });
        expect(result.current.isOpen).toBe(true);
    });

    it('should apply and remove coupon', () => {
        const { result } = renderHook(() => useCartStore());

        act(() => {
            result.current.applyCoupon('SAVE20');
        });
        expect(result.current.couponCode).toBe('SAVE20');

        act(() => {
            result.current.removeCoupon();
        });
        expect(result.current.couponCode).toBeNull();
    });
});
