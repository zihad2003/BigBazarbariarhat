import { NextResponse } from 'next/server';
import { MockDB } from '@/lib/mock-db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q')?.toLowerCase();
        
        let coupons = await MockDB.getCoupons();
        
        if (query) {
            coupons = coupons.filter(c => 
                c.code.toLowerCase().includes(query) || 
                c.description.toLowerCase().includes(query)
            );
        }
        
        return NextResponse.json({ success: true, data: coupons });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const coupon = await MockDB.createCoupon(body);
        return NextResponse.json({ success: true, data: coupon });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create coupon' }, { status: 500 });
    }
}
