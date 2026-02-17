
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        success: true,
        data: {
            id: 'default-store',
            store_name: 'Big Bazar',
            store_description: 'Premium Essentials',
            support_email: 'support@bigbazar.com',
            currency: 'BDT',
            default_language: 'en',
            logo_url: '/logo.png',
            social_links: {
                facebook: 'https://facebook.com/bigbazar',
                instagram: 'https://instagram.com/bigbazar'
            },
            footer_text: '© 2026 Big Bazar. All rights reserved.'
        }
    });
}
