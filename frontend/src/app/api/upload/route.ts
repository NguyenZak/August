import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
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
                            if (error) reject(error);
                            else resolve(result as UploadApiResponse);
                        }
                    );
                    uploadStream.end(buffer);
                });

                // Save to Database
                const dbResult = await query(
                    'INSERT INTO media (filename, url, public_id, resource_type, size, folder_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [file.name, uploadResult.secure_url, uploadResult.public_id, uploadResult.resource_type || 'raw', file.size, folder_id || null]
                );

                results.push({
                    url: uploadResult.secure_url,
                    public_id: uploadResult.public_id,
                    resource_type: uploadResult.resource_type || 'raw',
                    format: uploadResult.format,
                    filename: file.name,
                    id: dbResult.rows[0]?.id,
                    folder_id: folder_id || null,
                    storage: 'cloudinary'
                });

            } catch (fileError: any) {
                console.error(`Error processing individual file ${file.name}:`, fileError);
                throw new Error(`Failed to process ${file.name}: ${fileError.message || fileError}`);
            }
        }

        return NextResponse.json(results);

    } catch (error: any) {
        console.error('Bulk upload final error:', error);
        return NextResponse.json({
            message: 'Failed to upload files',
            error: error?.message || "Unknown error"
        }, { status: 500 });
    }
}
