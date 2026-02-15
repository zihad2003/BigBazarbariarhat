import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // @ts-ignore
        const banners = await prisma.banner.findMany({
            orderBy: [{ position: 'asc' }, { displayOrder: 'asc' }]
        });
        return NextResponse.json({ success: true, data: banners });
    } catch (error) {
        console.error('Admin Banners List API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch visual assets' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
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
        const banner = await prisma.banner.create({
            data: {
                title,
                subtitle,
                description,
                imageDesktop,
                imageMobile,
                linkUrl,
                linkText,
                position,
                displayOrder: parseInt(displayOrder || '0'),
                isActive: isActive ?? true,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null
            }
        });

        return NextResponse.json({ success: true, data: banner });
    } catch (error) {
        console.error('Admin Banner Creation API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to manifest visual asset' }, { status: 500 });
    }
}
