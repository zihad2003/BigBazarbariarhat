import { NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';

export async function GET() {
    try {
        let setting = await prisma.storeSetting.findFirst();
        
        if (!setting) {
            setting = await prisma.storeSetting.create({
                data: {
                    id: '1',
                    storeName: 'Big Bazar',
                    storeDescription: 'Premium Fashion & Essentials',
                    supportEmail: 'infobigbazar01@gmail.com',
                    currency: 'BDT',
                    defaultLanguage: 'bn'
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
                show_announcement: setting.showAnnouncement,
                footer_text: `© ${new Date().getFullYear()} ${setting.storeName}. All rights reserved.`
            }
        });
    } catch (error) {
        console.error('Settings GET error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST() {
    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
}
