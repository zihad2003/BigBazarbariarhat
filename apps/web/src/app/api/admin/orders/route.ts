import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    try {
        const result = await db.orders.findAll({
            status: searchParams.get('status') ?? undefined,
            page: Number(searchParams.get('page')) || 1,
            limit: Number(searchParams.get('limit')) || 20,
        });
        return NextResponse.json({ success: true, data: result });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to fetch orders.' }, { status: 500 });
    }
}
