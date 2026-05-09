import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@bigbazar/db';

export async function GET() {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }

    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, data: coupons });
    } catch (error) {
        console.error('Coupons GET Error:', error);
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
        const coupon = await prisma.coupon.create({
            data: {
                code: body.code,
                description: body.description || null,
                discountType: body.discountType,
                discountValue: body.discountValue,
                minOrderAmount: body.minOrderAmount ? parseFloat(body.minOrderAmount) : 0,
                usageLimit: body.usageLimit ? parseInt(body.usageLimit) : null,
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
                isActive: body.isActive !== false,
            }
        });
        return NextResponse.json({ success: true, data: coupon }, { status: 201 });
    } catch (error) {
        console.error('Coupons POST Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to create coupon.' }, { status: 500 });
    }
}
