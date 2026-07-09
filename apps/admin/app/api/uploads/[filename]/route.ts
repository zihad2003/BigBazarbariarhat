export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

/**
 * This route previously served files from the local `public/uploads/` directory
 * as a fallback when Cloudinary was not configured. The local filesystem is not
 * available in Edge Runtime (Cloudflare Pages / Workers), so this route now
 * returns a 404 with a clear message.
 *
 * If you need to serve uploaded images, configure Cloudinary via the environment
 * variables: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
 */
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params;
    return new NextResponse(
        JSON.stringify({
            error: 'Local file serving is not supported in Edge Runtime. ' +
                   'Configure Cloudinary to serve uploaded images.',
            filename,
        }),
        {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}
