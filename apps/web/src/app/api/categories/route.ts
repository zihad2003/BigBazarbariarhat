import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          children: true,
          _count: { select: { products: true } }
        }
      });
      return NextResponse.json({ success: true, data: category ? [category] : [] });
    }

    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
        _count: { select: { products: true } }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch categories.' }, { status: 500 });
  }
}
