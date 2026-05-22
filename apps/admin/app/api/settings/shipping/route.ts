import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { auth } from '@/auth';

export async function GET() {
    try {
        const zones = await prisma.shippingZone.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            data: zones
        });
    } catch (error) {
        console.error('Shipping GET Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch shipping zones' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, cities, rates, isActive } = body;

        if (!name) {
            return NextResponse.json({ success: false, message: 'Zone name is required' }, { status: 400 });
        }

        const zone = await prisma.shippingZone.create({
            data: {
                name,
                cities: cities || [],
                rates: rates || [],
                isActive: isActive !== undefined ? isActive : true
            }
        });

        return NextResponse.json({
            success: true,
            data: zone
        });
    } catch (error) {
        console.error('Shipping POST Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to create shipping zone' }, { status: 500 });
    }
}
