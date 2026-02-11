import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.siteSetting.findMany();
        const settingsMap = settings.reduce((acc: Record<string, any>, s: any) => {
            acc[s.key] = s.value;
            return acc;
        }, {});
        return NextResponse.json({ success: true, data: settingsMap });
    } catch (error) {
        console.error('Admin Settings API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json(); // { key: value, ... }

        const upserts = Object.entries(body).map(([key, value]) => {
            return prisma.siteSetting.upsert({
                where: { key },
                update: { value: value as any },
                create: { key, value: value as any }
            });
        });

        await Promise.all(upserts);

        return NextResponse.json({ success: true, message: 'Settings manifested' });
    } catch (error) {
        console.error('Admin Settings Update API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to manifest settings' }, { status: 500 });
    }
}
