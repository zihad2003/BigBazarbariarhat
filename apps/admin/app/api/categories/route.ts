import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { auth } from '@/auth';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                parent: { select: { name: true } },
                _count: { select: { products: true } }
            },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        console.error('Categories GET Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const category = await prisma.category.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                image: body.image,
                parentId: body.parentId || null,
            }
        });

        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        console.error('Category POST Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to create category' }, { status: 500 });
    }
}
