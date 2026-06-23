import { NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function GET(req: Request) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q')?.toLowerCase();
        
        const coupons = await prisma.coupon.findMany({
            where: query ? {
                OR: [
                    { code: { contains: query } },
                    { description: { contains: query } }
                ]
            } : undefined,
            orderBy: { createdAt: 'desc' }
        });
        
        return NextResponse.json({ success: true, data: coupons });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const body = await req.json();
        const coupon = await prisma.coupon.create({
            data: {
                ...body,
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
            }
        });
        return NextResponse.json({ success: true, data: coupon });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create coupon' }, { status: 500 });
    }
}
