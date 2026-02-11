import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const parentsOnly = searchParams.get('parentsOnly') === 'true';
    const includeChildren = searchParams.get('includeChildren') === 'true';

    try {
        if (slug) {
            const category = await prisma.category.findUnique({
                where: { slug },
                include: {
                    children: includeChildren,
                }
            });
            return NextResponse.json({ success: true, data: category ? [category] : [] });
        }

        const where: any = { isActive: true };
        if (parentsOnly) {
            where.parentId = null;
        }

        const categories = await prisma.category.findMany({
            where,
            include: {
                children: includeChildren ? {
                    where: { isActive: true },
                    orderBy: { displayOrder: 'asc' }
                } : false,
            },
            orderBy: {
                displayOrder: 'asc'
            }
        });

        return NextResponse.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Categories API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const category = await prisma.category.create({
            data: {
                name: body.name,
                slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                description: body.description,
                image: body.image,
                icon: body.icon,
                parentId: body.parentId,
                displayOrder: body.displayOrder || 0,
                isActive: body.isActive !== undefined ? body.isActive : true,
            }
        });

        return NextResponse.json({
            success: true,
            data: category,
            message: 'Category created successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Create Category Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
    }
}
