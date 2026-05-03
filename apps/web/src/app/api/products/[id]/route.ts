import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const product = await db.products.findById(id) ?? await db.products.findBySlug(id);
        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
        }
        const allProducts = await db.products.findMany({ category: product.category, limit: 5 });
        const related = allProducts.data.filter(p => p.id !== product.id).slice(0, 4);
        return NextResponse.json({ success: true, data: { ...product, related } });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to fetch product.' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }
    try {
        const body = await req.json();
        const updated = await db.products.update(id, body);
        if (!updated) {
            return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: updated });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to update product.' }, { status: 500 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }
    try {
        await db.products.delete(id);
        return NextResponse.json({ success: true, message: 'Product deleted.' });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to delete product.' }, { status: 500 });
    }
}
