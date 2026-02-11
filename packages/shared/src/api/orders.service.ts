import { fetchHandler } from './client';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Order, OrderFilters, CreateOrderInput, UpdateOrderStatusInput } from '../types/order.types';

export const OrdersService = {
    async getOrders(filters: OrderFilters & { page?: number; limit?: number }): Promise<PaginatedResponse<Order>> {
        const searchParams = new URLSearchParams();
        if (filters.status) searchParams.append('status', filters.status);
        if (filters.customerId) searchParams.append('customerId', filters.customerId);
        if (filters.page) searchParams.append('page', filters.page.toString());
        if (filters.limit) searchParams.append('limit', filters.limit.toString());

        return fetchHandler(`/api/orders?${searchParams.toString()}`);
    },

    async getOrderById(id: string): Promise<ApiResponse<Order>> {
        return fetchHandler(`/api/orders/${id}`);
    },

    async createOrder(data: CreateOrderInput): Promise<ApiResponse<Order>> {
        return fetchHandler('/api/orders', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async updateOrderStatus(id: string, data: UpdateOrderStatusInput): Promise<ApiResponse<Order>> {
        return fetchHandler(`/api/admin/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }
};
