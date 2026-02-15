import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // @ts-ignore
        const brands = await prisma.brand.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json({ success: true, data: brands });
    } catch (error) {
        console.error('Admin Brands List API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch brands' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, slug, description, logo, website, isActive } = body;

        // @ts-ignore
        const brand = await prisma.brand.create({
            data: {
                name,
                slug,
                description,
                logo,
                isActive: isActive ?? true
            }
        });

        return NextResponse.json({ success: true, data: brand });
    } catch (error) {
        console.error('Admin Brand Creation API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to manifest brand artifact' }, { status: 500 });
    }
}
