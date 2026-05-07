import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { auth } from '@/auth';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const banner = await prisma.banner.findUnique({
            where: { id }
        });
        if (!banner) return NextResponse.json({ success: false, message: 'Banner not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: banner });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to fetch banner' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const banner = await prisma.banner.update({
            where: { id },
            data: body
        });

        return NextResponse.json({ success: true, data: banner });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to update banner' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        await prisma.banner.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Banner deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to delete banner' }, { status: 500 });
    }
}
