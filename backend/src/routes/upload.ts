import type { Request, Response } from 'express';
import express from 'express';
import upload from '../middleware/upload.js';
import cloudinary from '../utils/cloudinary.js';
import { authenticateJWT } from '../middleware/auth.js';
import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const router = express.Router();

/**
 * POST /api/upload
 * Multi-part form data with 'files' field (multiple)
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

router.post('/', authenticateJWT, upload.array('files', 50), async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            console.log('Upload attempt with no files');
            return res.status(400).json({ message: 'No files uploaded' });
        }

        console.log(`Starting bulk upload of ${files.length} files (Hybrid Mode)`);

        const results = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i]!;
            try {
                const ext = path.extname(file.originalname).toLowerCase();
                const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext);

                if (!isImage) {
                    throw new Error("Only image uploads are supported (jpg, png, webp, gif, svg). PDF and Docs are removed.");
                }

                console.log(`Processing file ${i + 1}/${files.length}: ${file.originalname} (${file.size} bytes)`);

                let result;
                let storageType = 'cloudinary';

                let filePathToUpload = file.path;
                let isCompressed = false;

                // Always convert to WebP for optimization. Resize if extremely large.
                console.log(`Optimizing image ${file.originalname} to WebP...`);
                const compressedPath = path.join(path.dirname(file.path), `compressed-${file.filename}.webp`);
                await sharp(file.path)
                    .resize({ width: 2560, withoutEnlargement: true }) // Reasonable max width for the web
                    .webp({ quality: 80 }) // Convert to high-quality compressed WebP
                    .toFile(compressedPath);

                filePathToUpload = compressedPath;
                isCompressed = true;

                console.log(`Routing ${file.originalname} (WebP) to Cloudinary...`);
                result = await new Promise<any>((resolve, reject) => {
                    cloudinary.uploader.upload_large(filePathToUpload, {
                        folder: 'august-cms',
                        resource_type: 'auto',
                        chunk_size: 6000000
                    }, (error, res) => {
                        if (error) return reject(error);
                        resolve(res);
                    });
                });

                if (isCompressed && fs.existsSync(filePathToUpload)) {
                    fs.unlinkSync(filePathToUpload);
                }

                if (!result || !result.secure_url) {
                    throw new Error(`${storageType} did not return a secure_url`);
                }

                console.log(`${storageType} success for ${file.originalname}: ${result.secure_url}`);

                // Add a small delay to prevent Cloudinary rate limiting (e.g., maximum concurrent connections)
                if (i < files.length - 1) {
                    await delay(500);
                }

                // Save to media library
                const { folder_id } = req.body;
                const dbResult = await pool.query(
                    'INSERT INTO media (filename, url, public_id, resource_type, size, folder_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [file.originalname, result.secure_url, result.public_id, result.resource_type || 'raw', file.size, folder_id || null]
                );

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
            } catch (fileError: any) {
                console.error(`Error processing individual file ${file.originalname}:`, fileError);
                if (file.path && fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
                throw new Error(`Failed to process ${file.originalname}: ${fileError.message || fileError}`);
            }
        }

        console.log(`Hybrid upload completed successfully for ${results.length} files`);
        res.json(results);
    } catch (error: any) {
        console.error('Bulk upload final error:', error);
        res.status(500).json({
            message: 'Failed to upload files',
            error: error?.message || "Unknown error",
            stack: error?.stack
        });
    }
});

export default router;
