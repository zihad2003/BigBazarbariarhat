import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

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
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const { id } = await params;

        const body = await req.json();

        // Whitelist updatable fields to prevent field injection
        const data: any = {};
        if (body.title !== undefined) data.title = body.title;
        if (body.subtitle !== undefined) data.subtitle = body.subtitle;
        if (body.imageDesktop !== undefined) data.imageDesktop = body.imageDesktop;
        if (body.imageMobile !== undefined) data.imageMobile = body.imageMobile;
        if (body.videoUrl !== undefined) data.videoUrl = body.videoUrl;
        if (body.linkUrl !== undefined) data.linkUrl = body.linkUrl;
        if (body.linkText !== undefined) data.linkText = body.linkText;
        if (body.position !== undefined) data.position = body.position;
        if (body.displayOrder !== undefined) data.displayOrder = Number(body.displayOrder);
        if (body.isActive !== undefined) data.isActive = body.isActive;

        const banner = await prisma.banner.update({
            where: { id },
            data
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
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return authCheck.response;
        }

        const { id } = await params;

        await prisma.banner.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Banner deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to delete banner' }, { status: 500 });
    }
}
