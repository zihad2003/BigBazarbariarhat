import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email-service';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // Send internal notification alert
        console.log('--- INTERNAL CONTACT ALERT ---');
        console.log(`From: ${name} (${email})`);
        console.log(`Subject: ${subject || 'Inquiry'}`);
        console.log(`Message: ${message}`);

        // Send acknowledgment to user
        await EmailService.sendEmail({
            to: email,
            subject: 'Message Received: Big Bazar Concierge',
            html: EmailService.getContactAckTemplate(name)
        });

        return NextResponse.json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon!'
        });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
    }
}
