import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { OrderService } from '@bigbazar/database';
import { auth } from "@/auth";

export const GET = auth(async (req) => {
    try {
        if (!req.auth) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('q') || searchParams.get('search');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!req.auth?.user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Check for admin role
        const role = (req.auth.user as any)?.role;
        const isAdmin = role === 'SUPER_ADMIN' || role === 'MANAGER' || role === 'MODERATOR';

        // If not admin, force userId to be the authenticated user's ID
        // If admin, allowing filtering by specific userId if provided, otherwise fetch all
        const queryUserId = isAdmin ? (searchParams.get('userId') || searchParams.get('customerId') || undefined) : req.auth.user.id;

        const result = await OrderService.list({
            search: search || undefined,
            status: status || undefined,
            page,
            limit,
            userId: queryUserId,
        });

        return NextResponse.json({
            success: true,
            ...result, // data, pagination
        });
    } catch (error) {
        console.error('Orders API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
    }
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const order = await OrderService.create(body);
        return NextResponse.json({ success: true, data: order }, { status: 201 });
    } catch (error) {
        console.error('Create Order Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
    }
}
