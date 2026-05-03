import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const categories = await db.categories.findAll();
        return NextResponse.json({ success: true, data: categories });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to fetch categories.' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || (session.user as any)?.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const category = await db.categories.create(body);
        return NextResponse.json({ success: true, data: category }, { status: 201 });
    } catch {
        return NextResponse.json({ success: false, message: 'Failed to create category.' }, { status: 500 });
    }
}
