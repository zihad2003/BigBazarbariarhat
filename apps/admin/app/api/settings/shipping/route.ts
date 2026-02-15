import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // @ts-ignore
        const zones = await prisma.shippingZone.findMany({
            include: { rates: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, data: zones });
    } catch (error) {
        console.error('Admin Shipping API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch logistics manifest' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, cities, description } = body;

        // @ts-ignore
        const zone = await prisma.shippingZone.create({
            data: {
                name,
                cities,
                description,
                isActive: true
            }
        });

        return NextResponse.json({ success: true, data: zone });
    } catch (error) {
        console.error('Admin Shipping Zone Creation Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to manifest logistics zone' }, { status: 500 });
    }
}
