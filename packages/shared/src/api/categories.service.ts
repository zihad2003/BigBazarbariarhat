import { fetchHandler } from './client';
import { ApiResponse } from '../types/api.types';
import { Category } from '../types/product.types';

export const CategoriesService = {
    async getCategories(): Promise<ApiResponse<Category[]>> {
        return fetchHandler('/api/categories');
    },

    async getCategoryById(id: string): Promise<ApiResponse<Category>> {
        return fetchHandler(`/api/categories/${id}`);
    },

    async createCategory(data: any): Promise<ApiResponse<Category>> {
        return fetchHandler('/api/categories', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async deleteCategory(id: string): Promise<ApiResponse<Category>> {
        return fetchHandler(`/api/categories/${id}`, {
            method: 'DELETE',
        });
    }
};
