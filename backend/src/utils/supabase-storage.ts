import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing in .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Ensure the bucket exists and is public
 */
async function ensureBucketExists(bucket: string) {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some(b => b.name === bucket);

    if (!exists) {
        console.log(`Creating bucket: ${bucket}`);
        const { error } = await supabase.storage.createBucket(bucket, {
            public: true,
            fileSizeLimit: 1024 * 1024 * 1024, // 1GB
        });
        if (error) console.error('Error creating bucket:', error);
    }
}

/**
 * Upload a file from disk to Supabase Storage
 * @param filePath Path to the file on disk
 * @param fileName Original filename
 * @param bucket Bucket name (default: 'media')
 */
export const uploadToSupabase = async (filePath: string, fileName: string, bucket: string = 'media') => {
    try {
        await ensureBucketExists(bucket);
        const fileBuffer = fs.readFileSync(filePath);
        const fileExt = path.extname(fileName);
        const fileNameOnly = path.basename(fileName, fileExt);
        const uniqueName = `${fileNameOnly}-${Date.now()}${fileExt}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(uniqueName, fileBuffer, {
                contentType: getContentType(fileExt),
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return {
            secure_url: publicUrl,
            public_id: data.path,
            resource_type: 'raw', // Supabase handles all as raw/blob
            format: fileExt.replace('.', '')
        };
    } catch (error) {
        console.error('Supabase storage upload error:', error);
        throw error;
    }
};

function getContentType(ext: string): string {
    const types: Record<string, string> = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.zip': 'application/zip',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp'
    };
    return types[ext.toLowerCase()] || 'application/octet-stream';
}
