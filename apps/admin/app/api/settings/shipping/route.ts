export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { checkAdminAuth } from '@/lib/auth-utils';
import { shippingZoneRatesSchema } from '@bigbazar/validation';

export async function GET() {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }
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
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const body = await req.json();
        const { name, cities, rates, isActive } = body;

        if (!name) {
            return NextResponse.json({ success: false, message: 'Zone name is required' }, { status: 400 });
        }

        if (rates !== undefined && rates !== null) {
            const parsedRates = shippingZoneRatesSchema.safeParse(rates);
            if (!parsedRates.success) {
                return NextResponse.json({ success: false, message: 'Invalid shipping rates format' }, { status: 400 });
            }
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
