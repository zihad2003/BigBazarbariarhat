import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@bigbazar/database';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
    try {
        const { userId: authUserId } = await auth();
        const user = await currentUser();

        if (!authUserId || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('q') || searchParams.get('search');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Define admin role check - checking publicMetadata for 'role'
        const isAdmin = user.publicMetadata?.role === 'admin';

        // If not admin, force userId to be the authenticated user's ID
        // If admin, allowing filtering by specific userId if provided, otherwise fetch all
        const queryUserId = isAdmin ? (searchParams.get('userId') || searchParams.get('customerId')) : authUserId;

        const result = await OrderService.list({
            search,
            status,
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
}

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
