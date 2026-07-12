import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: { orderBy: { displayOrder: 'asc' } },
        _count: { select: { products: true } }
      }
    });

    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const { name, description, image, displayOrder, isHidden, newSlug } = body;

    // Find the category by slug (which is actually the ID in this route)
    let category = await prisma.category.findFirst({
      where: { OR: [{ slug }, { id: slug }] }
    });

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    const updated = await prisma.category.update({
      where: { id: category.id },
      data: {
        ...(name !== undefined && { name }),
        ...(newSlug !== undefined && { slug: newSlug }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) }),
        ...(isHidden !== undefined && { isHidden }),
      },
      include: {
        children: { orderBy: { displayOrder: 'asc' } },
        _count: { select: { products: true } }
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Categories PUT Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Find the category by slug or ID
    let category = await prisma.category.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
      include: { _count: { select: { products: true, children: true } } }
    });

    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    if (category._count?.products && category._count.products > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Cannot delete category with ${category._count.products} linked products. Remove or reassign them first.` 
      }, { status: 400 });
    }

    // Delete children first if any
    if (category._count?.children && category._count.children > 0) {
      await prisma.category.deleteMany({ where: { parentId: category.id } });
    }

    await prisma.category.delete({ where: { id: category.id } });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Categories DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
