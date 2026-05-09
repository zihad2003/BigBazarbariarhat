import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@bigbazar/db';

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    try {
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: {
                    ...(status ? { status: status as any } : {}),
                },
                include: {
                    user: {
                        select: { name: true, email: true }
                    },
                    items: {
                        include: { product: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.order.count({
                where: {
                    ...(status ? { status: status as any } : {}),
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                orders,
                total,
                page,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Admin Orders GET Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch orders.' }, { status: 500 });
    }
}
