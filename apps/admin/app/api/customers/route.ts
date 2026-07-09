export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import bcrypt from 'bcryptjs';
import { getCache, setCache, invalidateCachePattern } from '@/lib/cache';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function GET(req: Request) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) return authCheck.response;

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const query = searchParams.get('q') || '';
        const skip = (page - 1) * limit;

        const cacheKey = `customers-list-${page}-${limit}-${query}`;
        const cachedData = getCache<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json({ success: true, ...cachedData });
        }

        // Build search filter — only apply OR search when query is non-empty
        const searchFilter: any = { role: 'USER' };
        if (query) {
            searchFilter.OR = [
                { name: { startsWith: query } },
                { email: { startsWith: query } },
                { phone: { not: null, startsWith: query } },
            ];
        }

        // Fetch users with order stats
        const users = await prisma.user.findMany({
            where: searchFilter,
            include: {
                _count: {
                    select: { orders: true }
                },
                orders: {
                    select: { totalAmount: true }
                }
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        // Calculate total spent for each user
        const formattedUsers = users.map(user => {
            const totalSpent = user.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
            return {
                id: user.id,
                name: user.name || 'Anonymous',
                email: user.email,
                phone: user.phone || '',
                orderCount: user._count.orders,
                totalSpent: totalSpent,
                createdAt: user.createdAt,
            };
        });

        const total = await prisma.user.count({
            where: searchFilter,
        });

        const responseData = {
            data: formattedUsers,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
            }
        };

        setCache(cacheKey, responseData, 10 * 1000); // Cache for 10 seconds

        return NextResponse.json({
            success: true,
            ...responseData
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch customers' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) return authCheck.response;

        const body = await req.json();
        const { firstName, lastName, email, phone, password, role, avatar } = body;

        if (!email || !password) {
            return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
        }

        // Check if user already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ success: false, error: 'A user with this email already exists' }, { status: 409 });
        }

        // Check phone uniqueness if provided
        if (phone) {
            const existingPhone = await prisma.user.findUnique({ where: { phone } });
            if (existingPhone) {
                return NextResponse.json({ success: false, error: 'A user with this phone number already exists' }, { status: 409 });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Map frontend role values to database enum
        // Frontend uses 'CUSTOMER', 'STAFF', 'ADMIN' but DB uses 'USER', 'ADMIN', 'SUPER_ADMIN'
        let dbRole: 'USER' | 'ADMIN' | 'SUPER_ADMIN' = 'USER';
        if (role === 'ADMIN') dbRole = 'ADMIN';
        else if (role === 'SUPER_ADMIN') dbRole = 'SUPER_ADMIN';

        const name = [firstName, lastName].filter(Boolean).join(' ') || null;

        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone: phone || null,
                password: hashedPassword,
                role: dbRole,
                image: avatar || null,
            }
        });

        // Invalidate customer caches
        invalidateCachePattern('customers-');
        invalidateCachePattern('dashboard-stats');

        return NextResponse.json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                createdAt: user.createdAt,
            }
        });
    } catch (error) {
        console.error('Customer POST Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create customer' }, { status: 500 });
    }
}
