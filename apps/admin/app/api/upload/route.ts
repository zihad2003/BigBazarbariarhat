export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth-utils';

// Check if Cloudinary credentials are configured
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured =
    cloudName && cloudName !== 'your_cloud_name' &&
    apiKey && apiKey !== 'your_api_key' &&
    apiSecret && apiSecret !== 'your_api_secret';

async function generateSignature(params: Record<string, string>, secret: string): Promise<string> {
    const sortedKeys = Object.keys(params).sort();
    const paramString = sortedKeys.map(key => `${key}=${params[key]}`).join('&') + secret;

    const encoder = new TextEncoder();
    const data = encoder.encode(paramString);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: NextRequest) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) return authCheck.response;

        if (!isCloudinaryConfigured) {
            return NextResponse.json({
                success: false,
                message: 'Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.',
            }, { status: 503 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();

        // Signed upload to Cloudinary using direct fetch (Edge-compatible)
        const timestamp = Math.round(Date.now() / 1000).toString();
        const folder = 'bigbazar';

        const signatureParams = {
            folder,
            timestamp,
        };

        const signature = await generateSignature(signatureParams, apiSecret!);

        const uploadFormData = new FormData();
        const fileBlob = new Blob([arrayBuffer], { type: file.type });
        uploadFormData.append('file', fileBlob, file.name);
        uploadFormData.append('folder', folder);
        uploadFormData.append('timestamp', timestamp);
        uploadFormData.append('api_key', apiKey!);
        uploadFormData.append('signature', signature);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: uploadFormData,
        });

        const uploadResult = await response.json();

        if (!response.ok || uploadResult.error) {
            throw new Error(uploadResult.error?.message || `Cloudinary upload failed with status ${response.status}`);
        }

        return NextResponse.json({
            success: true,
            url: uploadResult.secure_url || uploadResult.url,
            secure_url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
        });
    } catch (error: any) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Upload failed' }, { status: 500 });
    }
}
