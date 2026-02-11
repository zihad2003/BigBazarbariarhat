import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, totalAmount, customerEmail, items } = body;

        if (!orderId || !totalAmount || !customerEmail) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: 'bdt',
                    product_data: {
                        name: item.name,
                        images: item.image ? [item.image] : [],
                    },
                    unit_amount: Math.round(item.price * 100), // Stripe expects cents/paisa
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?orderId=${orderId}`,
            customer_email: customerEmail,
            metadata: {
                orderId: orderId,
            },
        });

        return NextResponse.json({
            success: true,
            sessionId: session.id,
            url: session.url
        });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to initiate Stripe payment'
        }, { status: 500 });
    }
}
