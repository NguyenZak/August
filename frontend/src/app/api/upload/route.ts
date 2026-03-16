import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Route settings for Next.js App Router (allow larger uploads)
export const maxDuration = 60; // Set max execution time to 60s
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];
        const folder_id = formData.get('folder_id') as string | null;

        if (!files || files.length === 0) {
            return NextResponse.json({ message: 'No files uploaded' }, { status: 400 });
        }

        const results = [];

        for (const file of files) {
            try {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const isImage = file.type.startsWith('image/');

                // Upload stream promise
                console.log(`[Upload] Starting Cloudinary upload for: ${file.name} (${file.type}, ${file.size} bytes)`);
                const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'august-cms',
                            resource_type: isImage ? 'image' : 'auto',
                            format: isImage ? 'webp' : undefined,
                            transformation: isImage ? [
                                { width: 2560, crop: "limit" },
                                { quality: "auto:good" }
                            ] : []
                        },
                        (error, result) => {
                            if (error) {
                                console.error(`[Upload] Cloudinary error for ${file.name}:`, error);
                                reject(error);
                            } else {
                                console.log(`[Upload] Cloudinary success for ${file.name}:`, result?.secure_url);
                                resolve(result as UploadApiResponse);
                            }
                        }
                    );
                    uploadStream.end(buffer);
                });

                // Save to Database
                console.log(`[Upload] Saving to Supabase 'media' table: ${file.name}`);
                const { data: dbData, error: dbError } = await supabase
                    .from('media')
                    .insert([{
                        filename: file.name,
                        url: uploadResult.secure_url,
                        public_id: uploadResult.public_id,
                        resource_type: uploadResult.resource_type || 'raw',
                        size: file.size,
                        folder_id: folder_id || null
                    }])
                    .select();

                if (dbError) {
                    console.error(`[Upload] Supabase error for ${file.name}:`, dbError);
                    throw dbError;
                }
                console.log(`[Upload] Supabase success for ${file.name}, ID: ${dbData[0]?.id}`);

                results.push({
                    url: uploadResult.secure_url,
                    public_id: uploadResult.public_id,
                    resource_type: uploadResult.resource_type || 'raw',
                    format: uploadResult.format,
                    filename: file.name,
                    id: dbData[0]?.id,
                    folder_id: folder_id || null,
                    storage: 'cloudinary'
                });

            } catch (fileError: any) {
                console.error(`[Upload] Error processing individual file ${file.name}:`, fileError);
                throw fileError; // Propagate the actual error
            }
        }

        return NextResponse.json(results);

    } catch (error: any) {
        console.error('[Upload] Bulk upload final error:', error);
        return NextResponse.json({
            message: 'Failed to upload files',
            error: error?.message || error,
            details: error?.details || error?.hint || null
        }, { status: 500 });
    }
}
