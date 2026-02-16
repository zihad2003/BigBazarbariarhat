import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, ProductFilter } from '../types/product.types';

// Default client using standard env vars. 
// Can be overridden by initializing a new instance if needed.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const ProductsService = {
    async getProducts(filter: ProductFilter = {}) {
        let query = supabase
            .from('products')
            .select(`
                *,
                category:categories(id, name, slug),
                variants:product_variants(*)
            `, { count: 'exact' });

        if (filter.categoryId) {
            query = query.eq('category_id', filter.categoryId);
        }

        if (filter.minPrice !== undefined) {
            // Handle variants price? Or just base_price
            query = query.gte('base_price', filter.minPrice);
        }

        if (filter.maxPrice !== undefined) {
            query = query.lte('base_price', filter.maxPrice);
        }

        if (filter.search) {
            query = query.ilike('name', `%${filter.search}%`);
        }

        if (filter.onSale) {
            query = query.not('sale_price', 'is', null);
        }

        const page = filter.page || 1;
        const limit = filter.limit || 20;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        query = query.range(from, to);

        if (filter.sortBy) {
            switch (filter.sortBy) {
                case 'price_asc':
                    query = query.order('base_price', { ascending: true });
                    break;
                case 'price_desc':
                    query = query.order('base_price', { ascending: false });
                    break;
                case 'newest':
                    query = query.order('created_at', { ascending: false });
                    break;
                default:
                    query = query.order('created_at', { ascending: false });
            }
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching products:', error);
            return { success: false, error };
        }

        return { success: true, data: data as Product[], count };
    },

    async getProduct(slug: string) {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(id, name, slug),
                variants:product_variants(*)
            `)
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Error fetching product:', error);
            return { success: false, error };
        }

        return { success: true, data: data as Product };
    },

    async getCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) return { success: false, error };
        return { success: true, data };
    }
};
