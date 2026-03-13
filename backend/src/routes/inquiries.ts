import type { Request, Response } from 'express';
import express from 'express';
import { query } from '../config/database.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// GET /api/inquiries
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM inquiries ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/inquiries (Public)
router.post('/', async (req: Request, res: Response) => {
    const { name, email, phone, message, project_type } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email and message are required' });
    }

    try {
        const result = await query(
            'INSERT INTO inquiries (name, email, phone, message, project_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, phone, message, project_type]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating inquiry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE /api/inquiries/:id
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await query('DELETE FROM inquiries WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        console.error('Error deleting inquiry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
