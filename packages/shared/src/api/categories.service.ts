import { fetchHandler } from './client';
import { ApiResponse } from '../types/api.types';
import { Category } from '../types/product.types';

export const CategoriesService = {
    async getCategories(includeHidden = false): Promise<ApiResponse<Category[]>> {
        return fetchHandler(`/api/categories${includeHidden ? '?includeHidden=true' : ''}`);
    },

    async getCategoryById(id: string): Promise<ApiResponse<Category>> {
        return fetchHandler(`/api/categories/${id}`);
    },

    async createCategory(data: any): Promise<ApiResponse<Category>> {
        return fetchHandler('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    },

    async updateCategory(id: string, data: any): Promise<ApiResponse<Category>> {
        return fetchHandler(`/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    },

    async deleteCategory(id: string): Promise<ApiResponse<Category>> {
        return fetchHandler(`/api/categories/${id}`, {
            method: 'DELETE',
        });
    }
};
