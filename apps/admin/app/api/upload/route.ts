import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { checkAdminAuth } from '@/lib/auth-utils';

// Check if credentials are placeholder
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured =
    cloudName && cloudName !== 'your_cloud_name' &&
    apiKey && apiKey !== 'your_api_key' &&
    apiSecret && apiSecret !== 'your_api_secret';

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
}

export async function POST(req: NextRequest) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) return authCheck.response;

        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (!isCloudinaryConfigured) {
            console.warn('Cloudinary not configured. Saving file locally to public/uploads.');
            try {
                const fs = require('fs/promises');
                const path = require('path');
                const uploadDir = path.join(process.cwd(), 'public', 'uploads');
                
                // Ensure directory exists
                await fs.mkdir(uploadDir, { recursive: true });
                
                const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
                const filepath = path.join(uploadDir, filename);
                
                await fs.writeFile(filepath, buffer);
                
                const localUrl = `${req.nextUrl.origin}/api/uploads/${filename}`;
                return NextResponse.json({ success: true, url: localUrl, secure_url: localUrl });
            } catch (localError: any) {
                console.error('Local upload failed:', localError);
                return NextResponse.json({ success: false, message: 'Local upload failed: ' + localError.message }, { status: 500 });
            }
        }

        const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'bigbazar' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({
            success: true,
            url: uploadResult.secure_url || uploadResult.url,
            secure_url: uploadResult.secure_url,
            public_id: uploadResult.public_id
        });
    } catch (error: any) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Upload failed' }, { status: 500 });
    }
}
