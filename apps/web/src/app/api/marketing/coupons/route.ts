import { NextRequest, NextResponse } from 'next/server';
import { MarketingService as DbMarketingService } from '@bigbazar/database';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q') || '';

        const coupons = await DbMarketingService.getCoupons(q);
        return NextResponse.json({ success: true, data: coupons });
    } catch (error) {
        console.error('Marketing API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch promotions' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const coupon = await DbMarketingService.createCoupon(body);
        return NextResponse.json({ success: true, data: coupon });
    } catch (error) {
        console.error('Create Coupon Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to manifest coupon' }, { status: 500 });
    }
}
