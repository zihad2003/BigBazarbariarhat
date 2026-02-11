import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, totalAmount, customerName, customerEmail, customerPhone } = body;

        // SSLCommerz configuration via env
        const store_id = process.env.SSLCOMMERZ_STORE_ID;
        const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
        const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

        if (!store_id || !store_passwd) {
            return NextResponse.json({ success: false, error: 'SSLCommerz credentials missing' }, { status: 500 });
        }

        // Prepare payment payload
        const data = {
            store_id,
            store_passwd,
            total_amount: totalAmount,
            currency: 'BDT',
            tran_id: orderId,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/sslcommerz/success`,
            fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/sslcommerz/fail`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/sslcommerz/cancel`,
            ipn_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/sslcommerz/ipn`,
            cus_name: customerName,
            cus_email: customerEmail,
            cus_phone: customerPhone,
            cus_add1: 'Dhaka',
            cus_city: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            shipping_method: 'NO',
            product_name: 'Big Bazar Purchase',
            product_category: 'Ecommerce',
            product_profile: 'general'
        };

        const api_url = is_live
            ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
            : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

        // In a real implementation, you would use a form-data request here
        // For demonstration, we simulate the redirect initiation

        return NextResponse.json({
            success: true,
            message: 'SSLCommerz session initiated',
            gatewayUrl: `${api_url}?direct_pay_auth=1&...`, // This would normally be the response from SSLCommerz
            mock: true
        });
    } catch (error) {
        console.error('SSLCommerz Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to initiate SSLCommerz payment' }, { status: 500 });
    }
}
