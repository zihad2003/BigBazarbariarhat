import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = headers().get('stripe-signature')!

    let event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message)
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        )
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object

            // Create order in Supabase
            const { userId, shippingAddress } = session.metadata || {}

            if (userId) {
                const { data: order, error } = await supabaseAdmin
                    .from('orders')
                    .insert({
                        user_id: userId,
                        status: 'processing',
                        total: (session.amount_total || 0) / 100,
                        shipping_address: JSON.parse(shippingAddress || '{}'),
                    })
                    .select()
                    .single()

                if (error) {
                    console.error('Failed to create order:', error)
                } else {
                    console.log('Order created:', order.id)
                }
            }
            break
        }

        case 'payment_intent.succeeded': {
            console.log('Payment succeeded')
            break
        }

        case 'payment_intent.payment_failed': {
            console.log('Payment failed')
            break
        }

        default:
            console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
}
