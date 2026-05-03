import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const reviews = await db.reviews.findByProductId(id);
        const average = reviews.length
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
        reviews.forEach(r => { distribution[r.rating] = (distribution[r.rating] ?? 0) + 1; });

        return NextResponse.json({
            success: true,
            data: {
                reviews,
                summary: { average: Math.round(average * 10) / 10, count: reviews.length, distribution },
            },
        });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to fetch reviews.' }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: 'Login required to submit a review.' }, { status: 401 });
    }

    try {
        const { rating, comment } = await req.json();
        const review = await db.reviews.create({
            productId: id,
            userId: session.user.id,
            rating: Number(rating),
            comment,
        });
        return NextResponse.json({ success: true, data: review }, { status: 201 });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to submit review.' }, { status: 500 });
    }
}
