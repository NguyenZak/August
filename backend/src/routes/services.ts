import type { Request, Response } from 'express';
import express from 'express';
import { query } from '../config/database.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// GET /api/services
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM services ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/services
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
    const { title, description, category, icon } = req.body;

    if (!title || !category) {
        return res.status(400).json({ message: 'Title and category are required' });
    }

    try {
        const result = await query(
            'INSERT INTO services (title, description, category, icon) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, category, icon]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT /api/services/:id
router.put('/:id', authenticateJWT, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, category, icon } = req.body;

    try {
        const result = await query(
            'UPDATE services SET title = $1, description = $2, category = $3, icon = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [title, description, category, icon, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /api/services/:id
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
