import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET() {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }

    try {
        const coupons = await db.coupons.findAll();
        return NextResponse.json({ success: true, data: coupons });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to fetch coupons.' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const coupon = await db.coupons.create(body);
        return NextResponse.json({ success: true, data: coupon }, { status: 201 });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to create coupon.' }, { status: 500 });
    }
}
