import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { auth } from '@/auth';

export async function GET() {
    try {
        let setting = await prisma.storeSetting.findFirst();
        
        if (!setting) {
            // Create default settings if not exists
            setting = await prisma.storeSetting.create({
                data: {
                    id: '1',
                    storeName: 'Big Bazar',
                    storeDescription: 'A premium retail platform',
                    supportEmail: 'admin@bigbazar.com',
                    currency: 'BDT',
                    defaultLanguage: 'en'
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                id: setting.id,
                store_name: setting.storeName,
                store_description: setting.storeDescription,
                support_email: setting.supportEmail,
                currency: setting.currency,
                default_language: setting.defaultLanguage,
                announcement_text: setting.announcementText,
                show_announcement: setting.showAnnouncement
            }
        });
    } catch (error) {
        console.error('Settings GET Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { store_name, store_description, support_email, currency, default_language, announcement_text, show_announcement } = body;

        const setting = await prisma.storeSetting.upsert({
            where: { id: '1' },
            update: {
                storeName: store_name,
                storeDescription: store_description,
                supportEmail: support_email,
                currency,
                defaultLanguage: default_language,
                announcementText: announcement_text,
                showAnnouncement: show_announcement
            },
            create: {
                id: '1',
                storeName: store_name || 'Big Bazar',
                storeDescription: store_description || '',
                supportEmail: support_email || 'admin@bigbazar.com',
                currency: currency || 'BDT',
                defaultLanguage: default_language || 'en',
                announcementText: announcement_text || '',
                showAnnouncement: show_announcement !== undefined ? show_announcement : true
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                id: setting.id,
                store_name: setting.storeName,
                store_description: setting.storeDescription,
                support_email: setting.supportEmail,
                currency: setting.currency,
                default_language: setting.defaultLanguage,
                announcement_text: setting.announcementText,
                show_announcement: setting.showAnnouncement
            }
        });
    } catch (error) {
        console.error('Settings POST Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to save settings' }, { status: 500 });
    }
}

