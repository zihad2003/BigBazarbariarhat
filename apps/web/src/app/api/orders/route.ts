import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@bigbazar/database';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('q') || searchParams.get('search');
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const userId = searchParams.get('userId') || searchParams.get('customerId'); // Admin might filter by user

        // TODO: Add strict auth check here.
        // If current user is admin, allow userId filter.
        // If current user is customer, force userId = currentUserId (and ignore param unless it matches).

        const result = await OrderService.list({
            search,
            status,
            page,
            limit,
            userId,
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
