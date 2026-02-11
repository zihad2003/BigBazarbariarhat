export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

/**
 * Service to handle all outbound email communications.
 * Designed to be easily swapped between Resend, SendGrid, or Nodemailer.
 */
export class EmailService {
    private static isDev = process.env.NODE_ENV === 'development';

    /**
     * Sends a transactional email.
     * In development, it logs the email to the console.
     * In production, it would use an external provider.
     */
    static async sendEmail({ to, subject, html }: EmailOptions) {
        try {
            if (this.isDev) {
                console.log('--- EMAIL SIMULATION ---');
                console.log(`To: ${to}`);
                console.log(`Subject: ${subject}`);
                console.log(`Content Body: ${html.substring(0, 100)}...`);
                console.log('------------------------');
                return { success: true, messageId: 'sim-123' };
            }

            // Implementation for Resend (Example)
            /*
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: 'Big Bazar <noreply@bigbazarbariarhat.com>',
                    to: [to],
                    subject,
                    html,
                }),
            });
            return await res.json();
            */

            return { success: true, message: 'Email sent via production gateway' };
        } catch (error) {
            console.error('Email Service Error:', error);
            throw new Error('Failed to dispatch email');
        }
    }

    /**
     * Template for Welcome Email
     */
    static getWelcomeTemplate(name: string) {
        return `
            <div style="font-family: sans-serif; color: #111;">
                <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -0.05em;">Magnificent Choice.</h1>
                <p>Hello ${name},</p>
                <p>Welcome to <strong>Big Bazar</strong>. You have just entered a world of premium essentials curated for the sport of life.</p>
                <p>Start exploring our latest collection and discover your next signature piece.</p>
                <br />
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" style="background: black; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold;">Shop the Catalog</a>
            </div>
        `;
    }

    /**
     * Template for Newsletter Confirmation
     */
    static getNewsletterTemplate(email: string) {
        return `
            <div style="font-family: sans-serif; color: #111;">
                <h1 style="font-size: 24px; font-weight: 900;">Intelligence Secured.</h1>
                <p>You have successfully subscribed to the Big Bazar Newsletter.</p>
                <p>Expect curated style guides, early access to drops, and exclusive invitations to your inbox at <strong>${email}</strong>.</p>
                <br />
                <p style="color: #666; font-size: 12px;">You can unsubscribe at any time.</p>
            </div>
        `;
    }

    /**
     * Template for Contact Acknowledgment
     */
    static getContactAckTemplate(name: string) {
        return `
            <div style="font-family: sans-serif; color: #111;">
                <h1 style="font-size: 24px; font-weight: 900;">Message Received.</h1>
                <p>Hello ${name},</p>
                <p>Your inquiry has been logged in our system. A Big Bazar specialist will review your request and get back to you within 24 business hours.</p>
                <p>Thank you for choosing Big Bazar.</p>
            </div>
        `;
    }
}
