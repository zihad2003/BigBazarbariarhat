import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        success: true,
        data: {
            id: '1',
            store_name: 'Big Bazar',
            store_description: 'Premium Fashion & Essentials',
            support_email: 'infobigbazar01@gmail.com',
            currency: 'BDT',
            default_language: 'EN',
            footer_text: '© 2024 BIG BAZAR. All rights reserved.'
        }
    });
}

export async function POST() {
    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
}
