import express from 'express';
import upload from '../middleware/upload.js';
import cloudinary from '../utils/cloudinary.js';
import { uploadToSupabase } from '../utils/supabase-storage.js';
import { authenticateJWT } from '../middleware/auth.js';
import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
const router = express.Router();
/**
 * POST /api/upload
 * Multi-part form data with 'files' field (multiple)
 */
router.post('/', authenticateJWT, upload.array('files'), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            console.log('Upload attempt with no files');
            return res.status(400).json({ message: 'No files uploaded' });
        }
        console.log(`Starting bulk upload of ${files.length} files (Hybrid Mode)`);
        const results = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const ext = path.extname(file.originalname).toLowerCase();
                const isPdf = ext === '.pdf';
                const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext);
                console.log(`Processing file ${i + 1}/${files.length}: ${file.originalname} (${file.size} bytes)`);
                let result;
                let storageType = 'cloudinary';
                // Chiến lược: 
                // 1. Ảnh (< 10MB) -> Cloudinary (để dùng optimization)
                // 2. PDF hoặc Tệp lớn (> 10MB) -> Supabase Storage (ổn định, không giới hạn)
                if (isPdf || file.size > 10 * 1024 * 1024 || !isImage) {
                    console.log(`Routing ${file.originalname} to Supabase Storage...`);
                    result = await uploadToSupabase(file.path, file.originalname);
                    storageType = 'supabase';
                }
                else {
                    console.log(`Routing ${file.originalname} to Cloudinary...`);
                    result = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_large(file.path, {
                            folder: 'august-cms',
                            resource_type: 'auto',
                            chunk_size: 6000000
                        }, (error, res) => {
                            if (error)
                                return reject(error);
                            resolve(res);
                        });
                    });
                }
                if (!result || !result.secure_url) {
                    throw new Error(`${storageType} did not return a secure_url`);
                }
                console.log(`${storageType} success for ${file.originalname}: ${result.secure_url}`);
                // Save to media library
                const { folder_id } = req.body;
                const dbResult = await pool.query('INSERT INTO media (filename, url, public_id, resource_type, size, folder_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [file.originalname, result.secure_url, result.public_id, result.resource_type || 'raw', file.size, folder_id || null]);
                // Clean up: delete temporary file from disk
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
                results.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                    resource_type: result.resource_type || 'raw',
                    format: result.format || ext.replace('.', ''),
                    filename: file.originalname,
                    id: dbResult.rows[0]?.id,
                    folder_id: folder_id || null,
                    storage: storageType
                });
            }
            catch (fileError) {
                console.error(`Error processing individual file ${file.originalname}:`, fileError);
                if (file.path && fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
                throw new Error(`Failed to process ${file.originalname}: ${fileError.message || fileError}`);
            }
        }
        console.log(`Hybrid upload completed successfully for ${results.length} files`);
        res.json(results);
    }
    catch (error) {
        console.error('Bulk upload final error:', error);
        res.status(500).json({
            message: 'Failed to upload files',
            error: error?.message || "Unknown error",
            stack: error?.stack
        });
    }
});
export default router;
//# sourceMappingURL=upload.js.map