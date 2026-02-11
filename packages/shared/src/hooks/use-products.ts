import { useState, useEffect, useCallback } from 'react';
import { ProductsService } from '../api/products.service';
import { Product, ProductFilter, Category } from '../types/product.types';

export function useProducts(initialFilter: ProductFilter = {}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState<ProductFilter>(initialFilter);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await ProductsService.getProducts(filters);
            if (res.success && res.data) {
                setProducts(res.data);
                setTotal(res.count || 0);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await ProductsService.getCategories();
            if (res.success && res.data) {
                setCategories(res.data as Category[]);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const timer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timer);
    }, [fetchProducts]);

    const updateFilter = (key: keyof ProductFilter, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({ page: 1, limit: initialFilter.limit || 20, sortBy: 'newest' });
    };

    const nextPage = () => {
        setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
    };

    const prevPage = () => {
        setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }));
    };

    return {
        products,
        categories,
        loading,
        total,
        filters,
        updateFilter,
        clearFilters,
        nextPage,
        prevPage,
        refetch: fetchProducts,
    };
}
