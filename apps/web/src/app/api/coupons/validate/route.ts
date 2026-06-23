import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory global cache for rate limiting
(globalThis as any).__rateLimitCache ??= new Map<string, RateLimitRecord>();
const rateLimitCache = (globalThis as any).__rateLimitCache as Map<string, RateLimitRecord>;

const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

export async function POST(req: NextRequest) {
    try {
        // Rate limiting checks
        const ip = req.headers.get('x-forwarded-for') || 'anonymous';
        const currentTimestamp = Date.now();
        const record = rateLimitCache.get(ip) || { timestamps: [] };

        record.timestamps = record.timestamps.filter(t => currentTimestamp - t < RATE_LIMIT_WINDOW_MS);

        if (record.timestamps.length >= RATE_LIMIT_COUNT) {
            return NextResponse.json({
                success: false,
                valid: false,
                message: 'Too many coupon validation attempts. Please try again in a minute.'
            }, { status: 429 });
        }

        record.timestamps.push(currentTimestamp);
        rateLimitCache.set(ip, record);

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
