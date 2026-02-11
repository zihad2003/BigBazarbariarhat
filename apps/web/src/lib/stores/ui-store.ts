import { create } from 'zustand';
import type { ProductFilters } from '@/types';

type ViewMode = 'grid' | 'list';
type GridColumns = 2 | 3 | 4;

interface UIState {
    // Sidebar
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    openSidebar: () => void;
    closeSidebar: () => void;

    // Mobile menu
    isMobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
    openMobileMenu: () => void;
    closeMobileMenu: () => void;

    // Search
    isSearchOpen: boolean;
    searchQuery: string;
    toggleSearch: () => void;
    openSearch: () => void;
    closeSearch: () => void;
    setSearchQuery: (query: string) => void;

    // Product view
    viewMode: ViewMode;
    gridColumns: GridColumns;
    setViewMode: (mode: ViewMode) => void;
    setGridColumns: (columns: GridColumns) => void;

    // Filters
    filters: ProductFilters;
    isFiltersOpen: boolean;
    setFilters: (filters: Partial<ProductFilters>) => void;
    resetFilters: () => void;
    toggleFilters: () => void;

    // Quick view
    quickViewProductId: string | null;
    openQuickView: (productId: string) => void;
    closeQuickView: () => void;

    // Cart drawer
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;

    // Notifications
    notifications: Array<{
        id: string;
        type: 'success' | 'error' | 'info' | 'warning';
        message: string;
        duration?: number;
    }>;
    addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
    removeNotification: (id: string) => void;
}

const defaultFilters: ProductFilters = {
    sortBy: 'newest',
};

export const useUIStore = create<UIState>()((set, get) => ({
    // Sidebar
    isSidebarOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    openSidebar: () => set({ isSidebarOpen: true }),
    closeSidebar: () => set({ isSidebarOpen: false }),

    // Mobile menu
    isMobileMenuOpen: false,
    toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    openMobileMenu: () => set({ isMobileMenuOpen: true }),
    closeMobileMenu: () => set({ isMobileMenuOpen: false }),

    // Search
    isSearchOpen: false,
    searchQuery: '',
    toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
    openSearch: () => set({ isSearchOpen: true }),
    closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),
    setSearchQuery: (query) => set({ searchQuery: query }),

    // Product view
    viewMode: 'grid',
    gridColumns: 4,
    setViewMode: (mode) => set({ viewMode: mode }),
    setGridColumns: (columns) => set({ gridColumns: columns }),

    // Filters
    filters: defaultFilters,
    isFiltersOpen: false,
    setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
    })),
    resetFilters: () => set({ filters: defaultFilters }),
    toggleFilters: () => set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),

    // Quick view
    quickViewProductId: null,
    openQuickView: (productId) => set({ quickViewProductId: productId }),
    closeQuickView: () => set({ quickViewProductId: null }),

    // Cart drawer
    isCartOpen: false,
    openCart: () => set({ isCartOpen: true }),
    closeCart: () => set({ isCartOpen: false }),
    toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

    // Notifications
    notifications: [],
    addNotification: (notification) => {
        const id = `notification-${Date.now()}`;
        set((state) => ({
            notifications: [...state.notifications, { ...notification, id }],
        }));

        // Auto-remove after duration
        const duration = notification.duration || 5000;
        setTimeout(() => {
            get().removeNotification(id);
        }, duration);
    },
    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        }));
    },
}));
