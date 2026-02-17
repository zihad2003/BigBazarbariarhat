import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // @ts-ignore
        const banner = await prisma.banner.findUnique({
            where: { id: params.id }
        });

        if (!banner) {
            return NextResponse.json({ success: false, error: 'Asset not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: banner });
    } catch (error) {
        console.error('Admin Banner Detail API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch visual asset' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const {
            title,
            subtitle,
            description,
            imageDesktop,
            imageMobile,
            linkUrl,
            linkText,
            position,
            displayOrder,
            isActive,
            startDate,
            endDate
        } = body;

        // @ts-ignore
        const banner = await prisma.banner.update({
            where: { id: params.id },
            data: {
                title,
                subtitle,
                description,
                imageDesktop,
                imageMobile,
                linkUrl,
                linkText,
                position,
                displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : undefined,
                isActive: isActive ?? undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined
            }
        });

        return NextResponse.json({ success: true, data: banner });
    } catch (error) {
        console.error('Admin Banner Update API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update visual asset' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // @ts-ignore
        await prisma.banner.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true, message: 'Visual asset decommissioned' });
    } catch (error) {
        console.error('Admin Banner Delete API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to decommission asset' }, { status: 500 });
    }
}
