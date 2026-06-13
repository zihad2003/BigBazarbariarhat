import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new NextResponse('Missing url parameter', { status: 400 });
    }

    // Only allow proxying from known image domains
    const allowedDomains = ['instagram.com', 'cdninstagram.com', 'fbcdn.net', 'unsplash.com'];
    try {
        const urlObj = new URL(imageUrl);
        const isAllowed = allowedDomains.some(d => urlObj.hostname.endsWith(d));
        if (!isAllowed) {
            return new NextResponse('Domain not allowed', { status: 403 });
        }
    } catch {
        return new NextResponse('Invalid URL', { status: 400 });
    }

    try {
        // Follow redirects manually to ensure we buffer the final content
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.instagram.com/',
            },
            redirect: 'follow',
        });

        if (!response.ok) {
            // Return a 1x1 transparent PNG as fallback instead of an error
            const transparentPng = Buffer.from(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                'base64'
            );
            return new NextResponse(transparentPng, {
                headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'public, max-age=300',
                }
            });
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
                'Cross-Origin-Resource-Policy': 'cross-origin',
            }
        });
    } catch (error: any) {
        console.error('Proxy Image Error:', error);
        // Return a 1x1 transparent PNG as fallback
        const transparentPng = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            'base64'
        );
        return new NextResponse(transparentPng, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=300',
            }
        });
    }
}
