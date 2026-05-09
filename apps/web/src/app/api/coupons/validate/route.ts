import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

export async function POST(req: NextRequest) {
    try {
        const { code, cartTotal } = await req.json();
        if (!code) {
            return NextResponse.json({ success: false, valid: false, message: 'Coupon code is required.' }, { status: 400 });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.trim().toUpperCase() }
        });

        if (!coupon || !coupon.isActive) {
            return NextResponse.json({ success: false, valid: false, message: 'Invalid or inactive coupon code.' }, { status: 400 });
        }

        const now = new Date();
        if (now < coupon.startDate || now > coupon.endDate) {
            return NextResponse.json({ success: false, valid: false, message: 'This coupon has expired.' }, { status: 400 });
        }

        if (coupon.usageLimit && coupon.currentUsage >= coupon.usageLimit) {
            return NextResponse.json({ success: false, valid: false, message: 'This coupon usage limit has been reached.' }, { status: 400 });
        }

        const minOrder = Number(coupon.minOrderAmount);
        if (cartTotal < minOrder) {
            return NextResponse.json({
                success: false,
                valid: false,
                message: `Minimum order of ৳${minOrder} required for this coupon.`,
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            valid: true,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            message: 'Coupon applied successfully.',
        });
    } catch (error) {
        console.error('Coupon Validate Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to validate coupon.' }, { status: 500 });
    }
}
