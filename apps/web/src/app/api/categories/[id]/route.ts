import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@bigbazar/database';

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        await CategoryService.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete Category Error:', error);
        return NextResponse.json({ success: false, error: 'Termination failed' }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const category = await CategoryService.getById(id);
        if (!category) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Fetch failed' }, { status: 500 });
    }
}
