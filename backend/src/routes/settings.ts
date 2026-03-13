import type { Request, Response } from 'express';
import express from 'express';
import { query } from '../config/database.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// GET /api/settings - Public: Get all settings
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM site_settings');
        const settings = result.rows.reduce((acc: any, row: any) => {
            acc[row.key] = row.value;
            return acc;
        }, {});
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/settings - Private: Update settings bulk
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
    const settings = req.body; // Expecting { key: value, ... }

    try {
        for (const [key, value] of Object.entries(settings)) {
            await query(
                'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP',
                [key, value]
            );
        }
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
