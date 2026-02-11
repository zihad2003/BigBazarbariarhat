import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email-service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || !email.includes('@')) {
            return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
        }

        // Send confirmation email
        await EmailService.sendEmail({
            to: email,
            subject: 'Intelligence Secured: Big Bazar Newsletter',
            html: EmailService.getNewsletterTemplate(email)
        });

        return NextResponse.json({
            success: true,
            message: 'Successfully subscribed to our newsletter!'
        });
    } catch (error) {
        console.error('Newsletter API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to subscribe' }, { status: 500 });
    }
}
