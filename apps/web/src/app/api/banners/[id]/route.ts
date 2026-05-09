import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 });
    }

    const updated = await prisma.banner.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.subtitle !== undefined && { subtitle: body.subtitle }),
        ...(body.imageDesktop !== undefined && { imageDesktop: body.imageDesktop }),
        ...(body.imageMobile !== undefined && { imageMobile: body.imageMobile }),
        ...(body.linkUrl !== undefined && { linkUrl: body.linkUrl }),
        ...(body.linkText !== undefined && { linkText: body.linkText }),
        ...(body.position !== undefined && { position: body.position }),
        ...(body.displayOrder !== undefined && { displayOrder: parseInt(body.displayOrder) }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Banners PUT Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 });
    }

    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    console.error('Banners DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete banner' }, { status: 500 });
  }
}
