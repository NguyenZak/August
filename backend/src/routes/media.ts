import type { Request, Response } from 'express';
import express from 'express';
import pool from '../config/database.js';
import { authenticateJWT } from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Get all media items
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
    const { folder_id } = req.query;
    try {
        let queryText = 'SELECT * FROM media';
        const params: any[] = [];

        if (folder_id === 'root') {
            queryText += ' WHERE folder_id IS NULL';
        } else if (folder_id) {
            queryText += ' WHERE folder_id = $1';
            params.push(folder_id);
        }

        queryText += ' ORDER BY created_at DESC';
        const result = await pool.query(queryText, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ message: 'Failed to fetch media' });
    }
});

// Delete media item
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const mediaResult = await pool.query('SELECT public_id FROM media WHERE id = $1', [id]);
        if (mediaResult.rows.length === 0) return res.status(404).json({ message: 'Media not found' });
        const { public_id } = mediaResult.rows[0];

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(public_id);

        // Delete from DB
        await pool.query('DELETE FROM media WHERE id = $1', [id]);
        res.json({ message: 'Media deleted successfully' });
    } catch (error) {
        console.error('Error deleting media:', error);
        res.status(500).json({ message: 'Failed to delete media' });
    }
});

// POST /api/media/bulk-move - Di chuyển nhiều tệp tin
router.post('/bulk-move', authenticateJWT, async (req: Request, res: Response) => {
    const { ids, folder_id } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid IDs' });
    }

    try {
        await pool.query(
            'UPDATE media SET folder_id = $1 WHERE id = ANY($2)',
            [folder_id === 'root' ? null : folder_id, ids]
        );
        res.json({ message: 'Bulk move successful' });
    } catch (error) {
        console.error('Error bulk moving media:', error);
        res.status(500).json({ message: 'Failed to move media' });
    }
});

export default router;
