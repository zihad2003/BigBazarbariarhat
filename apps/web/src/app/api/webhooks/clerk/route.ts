import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occurred -- missing svix headers', {
            status: 400,
        });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occurred', { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === 'user.created' || eventType === 'user.updated') {
        const { id, email_addresses, first_name, last_name, image_url, public_metadata } = evt.data;

        const email = email_addresses?.[0]?.email_address;
        const role = (public_metadata as Record<string, string>)?.role || 'customer';

        const userData = {
            id,
            email: email || '',
            first_name: first_name || null,
            last_name: last_name || null,
            image_url: image_url || null,
            role,
        };

        const { error } = await supabaseAdmin
            .from('users')
            .upsert(userData as any, { onConflict: 'id' });

        if (error) {
            console.error('Error syncing user to Supabase:', error);
            return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
        }

        console.log(`User ${eventType === 'user.created' ? 'created' : 'updated'}: ${id}`);
    }

    if (eventType === 'user.deleted') {
        const { id } = evt.data;

        if (id) {
            const { error } = await supabaseAdmin
                .from('users')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting user from Supabase:', error);
            }
        }
    }

    return NextResponse.json({ received: true });
}
