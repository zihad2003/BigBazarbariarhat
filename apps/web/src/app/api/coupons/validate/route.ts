import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { code, cartTotal } = await req.json();
        if (!code) {
            return NextResponse.json({ success: false, valid: false, message: 'Coupon code is required.' }, { status: 400 });
        }

        const coupon = await db.coupons.findByCode(code.trim());
        if (!coupon) {
            return NextResponse.json({ success: false, valid: false, message: 'Invalid coupon code.' }, { status: 400 });
        }

        if (cartTotal < coupon.minOrder) {
            return NextResponse.json({
                success: false,
                valid: false,
                message: `Minimum order of ৳${coupon.minOrder} required for this coupon.`,
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            valid: true,
            discountType: coupon.type,
            discountValue: coupon.value,
            message: 'Coupon applied successfully.',
        });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to validate coupon.' }, { status: 500 });
    }
}
