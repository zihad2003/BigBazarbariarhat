import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { auth } from '@/auth';

export async function GET() {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { displayOrder: 'asc' }
        });
        return NextResponse.json({ success: true, data: banners });
    } catch (error) {
        console.error('Banners GET Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch banners' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const banner = await prisma.banner.create({
            data: {
                title: body.title,
                subtitle: body.subtitle,
                imageDesktop: body.imageDesktop || '',
                imageMobile: body.imageMobile,
                videoUrl: body.videoUrl || null,
                linkUrl: body.linkUrl,
                linkText: body.linkText,
                position: body.position || 'HERO_MAIN',
                displayOrder: Number(body.displayOrder) || 0,
                isActive: body.isActive !== undefined ? body.isActive : true,
            }
        });

        return NextResponse.json({ success: true, data: banner });
    } catch (error) {
        console.error('Banner POST Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to create banner' }, { status: 500 });
    }
}
