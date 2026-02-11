import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { displayOrder: 'asc' }
        });
        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        console.error('Admin Categories List API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, slug, description, image, icon, displayOrder, isActive, parentId } = body;

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
                image,
                icon,
                displayOrder: parseInt(displayOrder || '0'),
                isActive: isActive ?? true,
                parentId
            }
        });

        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        console.error('Admin Category Creation API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create collection' }, { status: 500 });
    }
}
