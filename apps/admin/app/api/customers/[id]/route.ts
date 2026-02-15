import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const customer = await prisma.user.findUnique({
            where: { id: params.id },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                addresses: true,
                reviews: {
                    include: { product: { select: { name: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });

        if (!customer) {
            return NextResponse.json({ success: false, error: 'Entity not found' }, { status: 404 });
        }

        const stats = {
            totalSpent: customer.orders.reduce((sum: number, order: any) => sum + Number(order.totalAmount), 0),
            orderCount: customer.orders.length,
            averageOrderValue: customer.orders.length > 0
                ? customer.orders.reduce((sum: number, order: any) => sum + Number(order.totalAmount), 0) / customer.orders.length
                : 0,
            lastOrder: customer.orders[0] || null
        };

        return NextResponse.json({
            success: true,
            data: { ...customer, stats }
        });
    } catch (error) {
        console.error('Admin Customer Detail API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch entity details' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { firstName, lastName, phone, avatar, role } = body;

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: {
                firstName,
                lastName,
                phone,
                avatar,
                role
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.error('Admin Customer Update API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update entity' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.user.delete({
            where: { id: params.id }
        });

        return NextResponse.json({
            success: true,
            message: 'Entity successfully decommissioned'
        });
    } catch (error) {
        console.error('Admin Customer Delete API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to decommission entity' }, { status: 500 });
    }
}
