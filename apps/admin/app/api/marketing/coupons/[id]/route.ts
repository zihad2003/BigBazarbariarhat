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
        const coupon = await prisma.coupon.update({
            where: { id },
            data: {
                ...body,
                startDate: body.startDate ? new Date(body.startDate) : undefined,
                endDate: body.endDate ? new Date(body.endDate) : undefined,
            }
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
