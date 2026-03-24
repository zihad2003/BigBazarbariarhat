import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@bigbazar/database';
import { auth } from "@/auth";

export const POST = auth(async (req) => {
    try {
        const body = await req.json();
        const { 
            items, 
            guestName, 
            guestPhone, 
            guestAddress, 
            guestArea, 
            paymentMethod,
            totalAmount,
            deliveryFee,
            note
        } = body;

        // Validation
        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
        }
        if (!guestPhone || !guestName || !guestAddress) {
             return NextResponse.json({ success: false, error: 'Missing shipping information' }, { status: 400 });
        }

        const userId = req.auth?.user?.id;

        const order = await OrderService.create({
            items,
            guestName,
            guestPhone,
            guestAddress,
            guestArea,
            paymentMethod,
            totalAmount,
            deliveryFee,
            note,
            userId,
        });

        return NextResponse.json({ 
            success: true, 
            orderId: order.id, 
            orderNumber: order.orderNumber 
        });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ success: false, error: 'Failed to place order' }, { status: 500 });
    }
});
