import { Product, ProductFilter } from '../types/product.types';

// Supabase is not used in this project. Stubbing it out to remove the dependency entirely.
export const supabase = null as any;

export const ProductsService = {
    async getProducts(filter: ProductFilter = {}) {
        console.warn('ProductsService.getProducts called, but Supabase is disabled.');
        return { success: true, data: [] as Product[], count: 0 };
    },

    async getProduct(slug: string) {
        console.warn('ProductsService.getProduct called, but Supabase is disabled.');
        return { success: false, error: new Error('Supabase is disabled') };
    },

    async getCategories() {
        console.warn('ProductsService.getCategories called, but Supabase is disabled.');
        return { success: true, data: [] };
    }
};
