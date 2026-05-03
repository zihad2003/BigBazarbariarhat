import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();
    const limit = Number(searchParams.get('limit')) || 10;

    if (!query) {
        return NextResponse.json({ success: true, data: [] });
    }

    try {
        const results = await db.products.search(query, limit);
        return NextResponse.json({ success: true, data: results });
    } catch {
        return NextResponse.json({ success: false, message: 'Search failed.' }, { status: 500 });
    }
}
