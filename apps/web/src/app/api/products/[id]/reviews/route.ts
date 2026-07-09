export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@bigbazar/db';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const reviews = await prisma.review.findMany({
            where: { productId: id },
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        });

        const average = reviews.length
            ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
            : 0;
            
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
        reviews.forEach((r: any) => { 
            distribution[r.rating] = (distribution[r.rating] || 0) + 1; 
        });

        return NextResponse.json({
            success: true,
            data: {
                reviews,
                summary: { average: Math.round(average * 10) / 10, count: reviews.length, distribution },
            },
        });
    } catch (error) {
        console.error('Reviews GET Error:', error);
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
        
        // B4: Pre-check for existing review and return error if duplicate
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId: id
                }
            }
        });

        if (existingReview) {
            return NextResponse.json({ success: false, message: 'You have already submitted a review for this product.' }, { status: 400 });
        }

        // B4: Use upsert instead of create to safely handle review creation/updates
        const review = await prisma.review.upsert({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId: id
                }
            },
            update: {
                rating: Number(rating),
                comment,
            },
            create: {
                productId: id,
                userId: session.user.id,
                rating: Number(rating),
                comment,
            },
            include: { user: { select: { name: true } } }
        });

        return NextResponse.json({ success: true, data: review }, { status: 201 });
    } catch (error) {
        console.error('Reviews POST Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to submit review.' }, { status: 500 });
    }
}
