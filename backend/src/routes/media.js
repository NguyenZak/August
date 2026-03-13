import express from 'express';
import pool from '../config/database.js';
import { authenticateJWT } from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';
const router = express.Router();
// Get all media items
router.get('/', authenticateJWT, async (req, res) => {
    const { folder_id } = req.query;
    try {
        let queryText = 'SELECT * FROM media';
        const params = [];
        if (folder_id === 'root') {
            queryText += ' WHERE folder_id IS NULL';
        }
        else if (folder_id) {
            queryText += ' WHERE folder_id = $1';
            params.push(folder_id);
        }
        queryText += ' ORDER BY created_at DESC';
        const result = await pool.query(queryText, params);
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching media:', error);
        res.status(500).json({ message: 'Failed to fetch media' });
    }
});
// Delete media item
router.delete('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        // Get public_id first to delete from Cloudinary
        const mediaResult = await pool.query('SELECT public_id FROM media WHERE id = $1', [id]);
        if (mediaResult.rows.length === 0) {
            return res.status(404).json({ message: 'Media not found' });
        }
        const { public_id } = mediaResult.rows[0];
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(public_id);
        // Delete from DB
        await pool.query('DELETE FROM media WHERE id = $1', [id]);
        res.json({ message: 'Media deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting media:', error);
        res.status(500).json({ message: 'Failed to delete media' });
    }
});
export default router;
//# sourceMappingURL=media.js.map