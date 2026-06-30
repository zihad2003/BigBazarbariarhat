import { NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const { id } = await params;
        const coupon = await prisma.coupon.findUnique({
            where: { id }
        });
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const { id } = await params;
        const body = await req.json();

        // Whitelist updatable fields to prevent field injection
        const data: any = {};
        if (body.code !== undefined) data.code = body.code;
        if (body.description !== undefined) data.description = body.description;
        if (body.discountType !== undefined) data.discountType = body.discountType;
        if (body.discountValue !== undefined) data.discountValue = Number(body.discountValue);
        if (body.minOrderAmount !== undefined) data.minOrderAmount = Number(body.minOrderAmount);
        if (body.usageLimit !== undefined) data.usageLimit = body.usageLimit ? Number(body.usageLimit) : null;
        if (body.isActive !== undefined) data.isActive = body.isActive;
        if (body.startDate) data.startDate = new Date(body.startDate);
        if (body.endDate) data.endDate = new Date(body.endDate);

        const coupon = await prisma.coupon.update({
            where: { id },
            data
        });
        return NextResponse.json({ success: true, data: coupon });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update coupon' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const { id } = await params;
        await prisma.coupon.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete coupon' }, { status: 500 });
    }
}
