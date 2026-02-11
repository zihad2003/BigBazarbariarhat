import { fetchHandler } from './client';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Customer, UserFilters } from '../types/user.types';

export const CustomersService = {
    async getCustomers(filters: UserFilters & { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Customer>> {
        const searchParams = new URLSearchParams();
        if (filters.search) searchParams.append('q', filters.search);
        if (filters.role) searchParams.append('role', filters.role);
        if (filters.isActive !== undefined) searchParams.append('isActive', String(filters.isActive));
        if (filters.page) searchParams.append('page', filters.page.toString());
        if (filters.limit) searchParams.append('limit', filters.limit.toString());

        return fetchHandler(`/api/customers?${searchParams.toString()}`);
    },

    async getCustomerById(id: string): Promise<ApiResponse<Customer>> {
        return fetchHandler(`/api/customers/${id}`);
    }
};
