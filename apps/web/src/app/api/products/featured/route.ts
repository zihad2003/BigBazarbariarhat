import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit')) || 8;
    try {
        const featured = await db.products.findFeatured(limit);
        return NextResponse.json({ success: true, data: featured });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to fetch featured products.' }, { status: 500 });
    }
}
