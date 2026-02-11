import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q') || '';

        const coupons = await prisma.coupon.findMany({
            where: {
                OR: [
                    { code: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                ]
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, data: coupons });
    } catch (error) {
        console.error('Admin Coupons List API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch promotional manifests' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            code,
            description,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscountAmount,
            usageLimit,
            usagePerUser,
            startDate,
            endDate,
            isActive
        } = body;

        const coupon = await prisma.coupon.create({
            data: {
                code,
                description,
                discountType,
                discountValue: parseFloat(discountValue),
                minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
                maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
                usageLimit: usageLimit ? parseInt(usageLimit) : null,
                usagePerUser: usagePerUser ? parseInt(usagePerUser) : null,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isActive: isActive ?? true
            }
        });

        return NextResponse.json({ success: true, data: coupon });
    } catch (error) {
        console.error('Admin Coupon Creation API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to manifest coupon' }, { status: 500 });
    }
}
