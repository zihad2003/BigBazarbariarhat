export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import { getCache, setCache, invalidateCachePattern } from '@/lib/cache';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function GET() {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) return authCheck.response;

        const cacheKey = 'settings-store';
        const cachedData = getCache<any>(cacheKey);
        if (cachedData) {
            return NextResponse.json({ success: true, data: cachedData });
        }

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

        const responseData = {
            id: setting.id,
            store_name: setting.storeName,
            store_description: setting.storeDescription,
            support_email: setting.supportEmail,
            currency: setting.currency,
            default_language: setting.defaultLanguage,
            announcement_text: setting.announcementText,
            show_announcement: setting.showAnnouncement,
            enable_steadfast: setting.enableSteadfastCheck,
            steadfast_api_key: setting.steadfastApiKey,
            steadfast_secret_key: setting.steadfastSecretKey
        };

        setCache(cacheKey, responseData, 30 * 1000); // Cache for 30 seconds

        return NextResponse.json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error('Settings GET Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) return authCheck.response;

        const body = await req.json();
        const { 
            store_name, 
            store_description, 
            support_email, 
            currency, 
            default_language, 
            announcement_text, 
            show_announcement,
            enable_steadfast,
            steadfast_api_key,
            steadfast_secret_key
        } = body;

        const setting = await prisma.storeSetting.upsert({
            where: { id: '1' },
            update: {
                storeName: store_name,
                storeDescription: store_description,
                supportEmail: support_email,
                currency,
                defaultLanguage: default_language || 'en',
                announcementText: announcement_text,
                showAnnouncement: show_announcement,
                enableSteadfastCheck: enable_steadfast !== undefined ? enable_steadfast : false,
                steadfastApiKey: steadfast_api_key || null,
                steadfastSecretKey: steadfast_secret_key || null
            },
            create: {
                id: '1',
                storeName: store_name || 'Big Bazar',
                storeDescription: store_description || '',
                supportEmail: support_email || 'admin@bigbazar.com',
                currency: currency || 'BDT',
                defaultLanguage: default_language || 'en',
                announcementText: announcement_text || '',
                showAnnouncement: show_announcement !== undefined ? show_announcement : true,
                enableSteadfastCheck: enable_steadfast !== undefined ? enable_steadfast : false,
                steadfastApiKey: steadfast_api_key || null,
                steadfastSecretKey: steadfast_secret_key || null
            }
        });

        // Invalidate settings caches
        invalidateCachePattern('settings-');
        invalidateCachePattern('dashboard-stats');

        const responseData = {
            id: setting.id,
            store_name: setting.storeName,
            store_description: setting.storeDescription,
            support_email: setting.supportEmail,
            currency: setting.currency,
            default_language: setting.defaultLanguage,
            announcement_text: setting.announcementText,
            show_announcement: setting.showAnnouncement,
            enable_steadfast: setting.enableSteadfastCheck,
            steadfast_api_key: setting.steadfastApiKey,
            steadfast_secret_key: setting.steadfastSecretKey
        };

        return NextResponse.json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error('Settings POST Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to save settings' }, { status: 500 });
    }
}


