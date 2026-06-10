import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function checkAdminAuth() {
    const session = await auth();
    if (!session || ((session as any)?.user?.role !== 'ADMIN' && (session as any)?.user?.role !== 'SUPER_ADMIN')) {
        return { 
            authorized: false, 
            response: NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 }) 
        };
    }
    return { authorized: true, session };
}
