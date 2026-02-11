import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, slug, description, logo, website, isActive } = body;

        const brand = await prisma.brand.update({
            where: { id: params.id },
            data: {
                name,
                slug,
                description,
                logo,
                website,
                isActive: isActive ?? undefined
            }
        });

        return NextResponse.json({ success: true, data: brand });
    } catch (error) {
        console.error('Admin Brand Update API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update brand artifact' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if brand has products
        const productsCount = await prisma.product.count({
            where: { brandId: params.id }
        });

        if (productsCount > 0) {
            return NextResponse.json({
                success: false,
                error: 'Cannot decommission brand with active product links'
            }, { status: 400 });
        }

        await prisma.brand.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true, message: 'Brand artifact decommissioned' });
    } catch (error) {
        console.error('Admin Brand Delete API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to decommission brand' }, { status: 500 });
    }
}
