import { fetchHandler } from './client';
import { ApiResponse } from '../types/api.types';
import { Coupon, CreateCouponInput } from '../types/marketing.types';

export const MarketingService = {
    async getCoupons(query?: string): Promise<ApiResponse<Coupon[]>> {
        const url = query ? `/api/marketing/coupons?q=${encodeURIComponent(query)}` : '/api/marketing/coupons';
        return fetchHandler(url);
    },

    async createCoupon(data: CreateCouponInput): Promise<ApiResponse<Coupon>> {
        return fetchHandler('/api/marketing/coupons', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async deleteCoupon(id: string): Promise<ApiResponse<void>> {
        return fetchHandler(`/api/marketing/coupons/${id}`, {
            method: 'DELETE',
        });
    }
};
