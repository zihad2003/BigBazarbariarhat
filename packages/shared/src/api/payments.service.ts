import { fetchHandler } from './client';
import { ApiResponse } from '../types/api.types';
import { PaymentMethod } from '../types/order.types';

export interface PaymentIntentResponse {
    clientSecret: string;
    paymentIntentId: string;
    publicKey: string;
}

export const PaymentsService = {
    async createPaymentIntent(orderId: string, method: PaymentMethod): Promise<ApiResponse<PaymentIntentResponse>> {
        return fetchHandler(`/api/payments/create-intent`, {
            method: 'POST',
            body: JSON.stringify({ orderId, method }),
        });
    },

    async confirmPayment(orderId: string, paymentIntentId: string): Promise<ApiResponse<void>> {
        return fetchHandler(`/api/payments/confirm`, {
            method: 'POST',
            body: JSON.stringify({ orderId, paymentIntentId }),
        });
    }
};
