import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: 'Login required to place an order.' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { items, deliveryAddress, paymentMethod, couponCode } = body;

        let subtotal = 0;
        for (const item of items) {
            const product = await db.products.findById(item.productId);
            if (!product) {
                return NextResponse.json({ success: false, message: `Product ${item.productId} not found.` }, { status: 404 });
            }
            if (product.stock < item.quantity) {
                return NextResponse.json({ success: false, message: `Insufficient stock for ${product.name}.` }, { status: 400 });
            }
            subtotal += (product.salePrice ?? product.basePrice) * item.quantity;
        }

        let shippingCost = subtotal > 1000 ? 0 : 60;
        let discount = 0;

        if (couponCode) {
            const coupon = await db.coupons.findByCode(couponCode);
            if (coupon && subtotal >= coupon.minOrder) {
                if (coupon.type === 'percent') discount = subtotal * (coupon.value / 100);
                else if (coupon.type === 'flat') discount = coupon.value;
                else if (coupon.type === 'free_shipping') shippingCost = 0;
            }
        }

        const total = subtotal - discount + shippingCost;

        const order = await db.orders.create(
            { userId: session.user.id, items, deliveryAddress, paymentMethod, couponCode },
            { subtotal, shippingCost, discount, total }
        );

        return NextResponse.json({
            success: true,
            data: { orderId: order.id, total: order.total, estimatedDelivery: '3-5 business days' },
        }, { status: 201 });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to place order.' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: 'Login required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    try {
        const result = await db.orders.findByUserId(session.user.id, {
            status: searchParams.get('status') ?? undefined,
            page: Number(searchParams.get('page')) || 1,
            limit: Number(searchParams.get('limit')) || 10,
        });
        return NextResponse.json({ success: true, data: result });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to fetch orders.' }, { status: 500 });
    }
}
