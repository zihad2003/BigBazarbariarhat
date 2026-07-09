export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { checkAdminAuth } from '@/lib/auth-utils';
import { shippingZoneRatesSchema } from '@bigbazar/validation';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const { id } = await params;
        const body = await req.json();
        const { name, cities, rates, isActive } = body;

        if (rates !== undefined && rates !== null) {
            const parsedRates = shippingZoneRatesSchema.safeParse(rates);
            if (!parsedRates.success) {
                return NextResponse.json({ success: false, message: 'Invalid shipping rates format' }, { status: 400 });
            }
        }

        // Only include fields that were actually provided to prevent wiping data on partial updates
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (cities !== undefined) updateData.cities = cities;
        if (rates !== undefined) updateData.rates = rates;
        if (isActive !== undefined) updateData.isActive = isActive;

        const zone = await prisma.shippingZone.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            data: zone
        });
    } catch (error) {
        console.error('Shipping PATCH Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to update shipping zone' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const { id } = await params;

        await prisma.shippingZone.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Shipping zone deleted successfully'
        });
    } catch (error) {
        console.error('Shipping DELETE Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to delete shipping zone' }, { status: 500 });
    }
}
