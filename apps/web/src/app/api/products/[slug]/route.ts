import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const slug = params.slug;

    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
                brand: true,
                images: {
                    orderBy: { displayOrder: 'asc' },
                },
                variants: {
                    where: { isActive: true },
                },
                reviews: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                avatar: true,
                            }
                        }
                    }
                }
            }
        });

        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        // Increment view count
        await prisma.product.update({
            where: { id: product.id },
            data: { viewCount: { increment: 1 } }
        });

        return NextResponse.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Product Detail API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch product details' }, { status: 500 });
    }
}
