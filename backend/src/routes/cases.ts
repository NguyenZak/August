import type { Request, Response } from 'express';
import express from 'express';
import { query } from '../config/database.js';
import { authenticateJWT } from '../middleware/auth.js';
import { generateUniqueSlug } from '../utils/slug.js';

const router = express.Router();

// GET /api/cases - Public: Get all cases
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM cases ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching cases:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/cases/:id - Public: Get case by ID or Slug
router.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id as string;
    try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const queryStr = isUUID
            ? 'SELECT * FROM cases WHERE id = $1'
            : 'SELECT * FROM cases WHERE slug = $1';

        const result = await query(queryStr, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Case not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching case:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/cases - Private: Create a new case
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
    const { title, image_url, category, grid_row, grid_col, grid_row_span, grid_col_span, content, industry, menu_url } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const slug = await generateUniqueSlug(title, 'cases');

        const result = await query(
            'INSERT INTO cases (title, slug, image_url, category, grid_row, grid_col, grid_row_span, grid_col_span, content, industry, menu_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [title, slug, image_url, category, grid_row, grid_col, grid_row_span, grid_col_span, content, industry, menu_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating case:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT /api/cases/:id - Private: Update a case
router.put('/:id', authenticateJWT, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, image_url, category, grid_row, grid_col, grid_row_span, grid_col_span, content, industry, menu_url } = req.body;

    try {
        const result = await query(
            'UPDATE cases SET title = $1, image_url = $2, category = $3, grid_row = $4, grid_col = $5, grid_row_span = $6, grid_col_span = $7, content = $8, industry = $9, menu_url = $10, updated_at = CURRENT_TIMESTAMP WHERE id = $11 RETURNING *',
            [title, image_url, category, grid_row, grid_col, grid_row_span, grid_col_span, content, industry, menu_url, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Case not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating case:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT /api/cases/reorder - Private: Reorder cases
router.put('/reorder', authenticateJWT, async (req: Request, res: Response) => {
    const { items } = req.body; // Array of { id, grid_row }

    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ message: 'Invalid items array' });
    }

    try {
        await query('BEGIN');

        for (const item of items) {
            await query(
                'UPDATE cases SET grid_row = $1 WHERE id = $2',
                [item.grid_row, item.id]
            );
        }

        await query('COMMIT');
        res.json({ message: 'Reordered successfully' });
    } catch (error) {
        await query('ROLLBACK');
        console.error('Error reordering cases:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /api/cases/:id - Private: Delete a case
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await query('DELETE FROM cases WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Case not found' });
        }

        res.json({ message: 'Case deleted successfully' });
    } catch (error) {
        console.error('Error deleting case:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
