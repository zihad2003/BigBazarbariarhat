import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@bigbazar/db';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        // Try finding by ID first, then by Slug
        let product = await prisma.product.findUnique({
            where: { id },
            include: { category: true, reviews: { include: { user: true } } }
        });

        if (!product) {
            product = await prisma.product.findUnique({
                where: { slug: id },
                include: { category: true, reviews: { include: { user: true } } }
            });
        }

        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
        }

        // Fetch related products from the same category
        const related = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                NOT: { id: product.id },
                isActive: true
            },
            take: 4,
            include: { category: true }
        });

        return NextResponse.json({ success: true, data: { ...product, related } });
    } catch (error) {
        console.error('Product GET Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch product.' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN') {
        return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }
    try {
        const body = await req.json();
        const updated = await prisma.product.update({
            where: { id },
            data: body
        });
        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to update product.' }, { status: 500 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'ADMIN') {
        return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }
    try {
        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ success: true, message: 'Product deleted.' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to delete product.' }, { status: 500 });
    }
}
