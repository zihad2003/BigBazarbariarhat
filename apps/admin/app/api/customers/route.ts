import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const where: any = {
            OR: [
                { firstName: { contains: q, mode: 'insensitive' } },
                { lastName: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
            ]
        };

        const [customers, total] = await Promise.all([
            prisma.user.findMany({
                where,
                include: {
                    _count: {
                        select: { orders: true }
                    },
                    orders: {
                        select: { totalAmount: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.user.count({ where })
        ]);

        // Calculate Customer Lifetime Value (CLV)
        const formattedCustomers = customers.map((customer: any) => {
            const clv = customer.orders.reduce((sum: number, order: any) => sum + Number(order.totalAmount), 0);
            const { orders: _orders, ...rest } = customer;
            return {
                ...rest,
                orderCount: customer._count.orders,
                totalSpent: clv
            };
        });

        return NextResponse.json({
            success: true,
            data: formattedCustomers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Admin Customers List API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch entities' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, phone, avatar, role } = body;

        // Note: In a production system integrated with Clerk, 
        // user creation should be handled via Clerk API to ensure synchronization.
        const customer = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                avatar,
                role: role || 'CUSTOMER',
                passwordHash: 'clerk_managed', // Database constraint requires a value
            }
        });

        return NextResponse.json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.error('Admin Customer Creation API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to integrate entity' }, { status: 500 });
    }
}
