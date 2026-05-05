import { NextResponse } from 'next/server';
import { MockDB } from '@/lib/mock-db';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const coupon = await MockDB.getCoupon(params.id);
        if (!coupon) {
            return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: coupon });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch coupon' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const coupon = await MockDB.updateCoupon(params.id, body);
        if (!coupon) {
            return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: coupon });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update coupon' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await MockDB.deleteCoupon(params.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete coupon' }, { status: 500 });
    }
}
