import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUIStore } from '@/lib/stores/ui-store';

/**
 * Unit tests for the UI Store.
 * Tests sidebar, mobile menu, search, cart drawer, and notification state.
 */
describe('UI Store', () => {
    beforeEach(() => {
        const { result } = renderHook(() => useUIStore());
        act(() => {
            result.current.closeSidebar();
            result.current.closeMobileMenu();
            result.current.closeSearch();
            result.current.closeCart();
        });
    });

    it('should toggle sidebar', () => {
        const { result } = renderHook(() => useUIStore());

        expect(result.current.isSidebarOpen).toBe(false);

        act(() => result.current.toggleSidebar());
        expect(result.current.isSidebarOpen).toBe(true);

        act(() => result.current.toggleSidebar());
        expect(result.current.isSidebarOpen).toBe(false);
    });

    it('should open/close mobile menu', () => {
        const { result } = renderHook(() => useUIStore());

        act(() => result.current.openMobileMenu());
        expect(result.current.isMobileMenuOpen).toBe(true);

        act(() => result.current.closeMobileMenu());
        expect(result.current.isMobileMenuOpen).toBe(false);
    });

    it('should manage search state', () => {
        const { result } = renderHook(() => useUIStore());

        act(() => result.current.openSearch());
        expect(result.current.isSearchOpen).toBe(true);

        act(() => result.current.setSearchQuery('test query'));
        expect(result.current.searchQuery).toBe('test query');

        act(() => result.current.closeSearch());
        expect(result.current.isSearchOpen).toBe(false);
        expect(result.current.searchQuery).toBe('');
    });

    it('should manage cart drawer state', () => {
        const { result } = renderHook(() => useUIStore());

        expect(result.current.isCartOpen).toBe(false);

        act(() => result.current.openCart());
        expect(result.current.isCartOpen).toBe(true);

        act(() => result.current.closeCart());
        expect(result.current.isCartOpen).toBe(false);

        act(() => result.current.toggleCart());
        expect(result.current.isCartOpen).toBe(true);
    });

    it('should add and remove notifications', () => {
        const { result } = renderHook(() => useUIStore());

        act(() => {
            result.current.addNotification({
                type: 'success',
                message: 'Item added!',
                duration: 999999, // long duration so it doesn't auto-remove
            });
        });

        expect(result.current.notifications).toHaveLength(1);
        expect(result.current.notifications[0].message).toBe('Item added!');

        const id = result.current.notifications[0].id;

        act(() => {
            result.current.removeNotification(id);
        });

        expect(result.current.notifications).toHaveLength(0);
    });

    it('should set view mode and grid columns', () => {
        const { result } = renderHook(() => useUIStore());

        act(() => result.current.setViewMode('list'));
        expect(result.current.viewMode).toBe('list');

        act(() => result.current.setGridColumns(2));
        expect(result.current.gridColumns).toBe(2);
    });

    it('should manage quick view state', () => {
        const { result } = renderHook(() => useUIStore());

        act(() => result.current.openQuickView('product-123'));
        expect(result.current.quickViewProductId).toBe('product-123');

        act(() => result.current.closeQuickView());
        expect(result.current.quickViewProductId).toBeNull();
    });
});
