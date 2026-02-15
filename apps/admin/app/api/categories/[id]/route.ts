import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { name, slug, description, image, icon, displayOrder, isActive, parentId } = body;

        // @ts-ignore
        const category = await prisma.category.update({
            where: { id: params.id },
            data: {
                name,
                slug,
                description,
                image,
                icon,
                displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : undefined,
                isActive: isActive ?? undefined,
                parentId
            }
        });

        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        console.error('Admin Category Update API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update collection' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check if category has products
        const productsCount = await prisma.product.count({
            where: { categoryId: params.id }
        });

        if (productsCount > 0) {
            return NextResponse.json({
                success: false,
                error: 'Cannot delete collection with active product links'
            }, { status: 400 });
        }

        // @ts-ignore
        await prisma.category.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true, message: 'Collection decommissioned' });
    } catch (error) {
        console.error('Admin Category Delete API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to decommission collection' }, { status: 500 });
    }
}
