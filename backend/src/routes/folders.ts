import type { Request, Response } from 'express';
import express from 'express';
import { query } from '../config/database.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// GET /api/folders - Lấy danh sách thư mục
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM folders ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching folders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/folders - Tạo thư mục mới
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
    const { name, parent_id } = req.body;
    if (!name) return res.status(400).json({ message: 'Folder name is required' });

    try {
        const result = await query(
            'INSERT INTO folders (name, parent_id) VALUES ($1, $2) RETURNING *',
            [name, parent_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /api/folders/:id - Xóa thư mục
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // Cập nhật các tệp tin trong thư mục này về root (null) trước khi xóa
        await query('UPDATE media SET folder_id = NULL WHERE folder_id = $1', [id]);
        const result = await query('DELETE FROM folders WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) return res.status(404).json({ message: 'Folder not found' });
        res.json({ message: 'Folder deleted successfully' });
    } catch (error) {
        console.error('Error deleting folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT /api/folders/:id - Cập nhật thư mục (Rename hoặc Move)
router.put('/:id', authenticateJWT, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, parent_id } = req.body;

    try {
        const result = await query(
            'UPDATE folders SET name = COALESCE($1, name), parent_id = $2 WHERE id = $3 RETURNING *',
            [name, parent_id === undefined ? undefined : parent_id, id]
        );

        if (result.rowCount === 0) return res.status(404).json({ message: 'Folder not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating folder:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
