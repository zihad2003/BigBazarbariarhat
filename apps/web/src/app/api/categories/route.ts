export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const includeHidden = searchParams.get('includeHidden') === 'true';

    if (slug) {
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          children: { orderBy: { displayOrder: 'asc' } },
          _count: { select: { products: true } }
        }
      });
      return NextResponse.json({ success: true, data: category ? [category] : [] });
    }

    const categories = await prisma.category.findMany({
      where: {
        parentId: null,
        ...(includeHidden ? {} : { isHidden: false }),
      },
      include: {
        children: {
          where: includeHidden ? {} : { isHidden: false },
          orderBy: { displayOrder: 'asc' },
        },
        _count: { select: { products: true } }
      },
      orderBy: { displayOrder: 'asc' }
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch categories.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, image, parentId, displayOrder, isHidden } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, error: 'Name and slug are required.' }, { status: 400 });
    }

    // Check for duplicate slug
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'A category with this slug already exists.' }, { status: 409 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        parentId: parentId || null,
        displayOrder: parseInt(displayOrder) || 0,
        isHidden: isHidden || false,
      },
      include: {
        children: true,
        _count: { select: { products: true } }
      }
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error('Categories POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create category.' }, { status: 500 });
  }
}
