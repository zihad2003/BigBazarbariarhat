import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // @ts-ignore
        const coupon = await prisma.coupon.findUnique({
            where: { id: params.id }
        });

        if (!coupon) {
            return NextResponse.json({ success: false, error: 'Promo not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: coupon });
    } catch (error) {
        console.error('Admin Coupon Detail API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch promotion' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        // @ts-ignore
        const coupon = await prisma.coupon.update({
            where: { id: params.id },
            data: {
                code,
                description,
                discountType,
                discountValue: discountValue ? parseFloat(discountValue) : undefined,
                minOrderAmount: minOrderAmount !== undefined ? parseFloat(minOrderAmount) : undefined,
                maxDiscountAmount: maxDiscountAmount !== undefined ? parseFloat(maxDiscountAmount) : undefined,
                usageLimit: usageLimit !== undefined ? parseInt(usageLimit) : undefined,
                usagePerUser: usagePerUser !== undefined ? parseInt(usagePerUser) : undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                isActive: isActive ?? undefined
            }
        });

        return NextResponse.json({ success: true, data: coupon });
    } catch (error) {
        console.error('Admin Coupon Update API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update promotional manifest' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // @ts-ignore
        await prisma.coupon.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true, message: 'Promotional manifest terminated' });
    } catch (error) {
        console.error('Admin Coupon Delete API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to terminate manifest' }, { status: 500 });
    }
}
