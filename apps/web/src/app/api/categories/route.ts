import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@bigbazar/database';

export async function GET() {
    try {
        const categories = await CategoryService.list();
        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        console.error('Categories API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const category = await CategoryService.create(body);
        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        console.error('Create Category Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to create collection' }, { status: 500 });
    }
}
