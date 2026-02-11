/**
 * Payment Gateway Integration Service
 * Supporting Stripe, SSLCommerz, and local cash/wallet methods
 */

export type PaymentMethod = 'BKASH' | 'NAGAD' | 'STRIPE' | 'CASH_ON_DELIVERY' | 'SSLCOMMERZ';

export interface PaymentPayload {
    orderId: string;
    totalAmount: number;
    currency: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
}

export async function initiatePayment(method: PaymentMethod, payload: PaymentPayload) {
    switch (method) {
        case 'STRIPE':
            return initiateStripePayment(payload);
        case 'SSLCOMMERZ':
            return initiateSSLCommerzPayment(payload);
        case 'BKASH':
            return initiateBkashPayment(payload);
        case 'NAGAD':
            return initiateNagadPayment(payload);
        case 'CASH_ON_DELIVERY':
            return { success: true, method: 'COD', redirectUrl: `/order-success?orderId=${payload.orderId}` };
        default:
            throw new Error(`Unsupported payment method: ${method}`);
    }
}

async function initiateStripePayment(payload: PaymentPayload) {
    const res = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return res.json();
}

async function initiateSSLCommerzPayment(payload: PaymentPayload) {
    // SSLCommerz implementation
    const res = await fetch('/api/checkout/sslcommerz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return res.json();
}

async function initiateBkashPayment(payload: PaymentPayload) {
    // Direct bKash API integration via gateway
    const res = await fetch('/api/checkout/bkash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return res.json();
}

async function initiateNagadPayment(payload: PaymentPayload) {
    // Direct Nagad API integration via gateway
    const res = await fetch('/api/checkout/nagad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return res.json();
}
