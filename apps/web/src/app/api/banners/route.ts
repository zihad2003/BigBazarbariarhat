import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const position = searchParams.get('position');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const banners = await prisma.banner.findMany({
      where: {
        ...(position ? { position } : {}),
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    console.error('Banners GET Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch banners.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, subtitle, imageDesktop, imageMobile, linkUrl, linkText, position, displayOrder, isActive } = body;

    if (!title || !imageDesktop || !position) {
      return NextResponse.json({ success: false, error: 'Title, image, and position are required.' }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle: subtitle || null,
        imageDesktop,
        imageMobile: imageMobile || null,
        linkUrl: linkUrl || null,
        linkText: linkText || null,
        position,
        displayOrder: parseInt(displayOrder) || 0,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error) {
    console.error('Banners POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create banner.' }, { status: 500 });
  }
}
