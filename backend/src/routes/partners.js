import express from 'express';
import { query } from '../config/database.js';
import { authenticateJWT } from '../middleware/auth.js';
const router = express.Router();
// GET /api/partners
router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM partners ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching partners:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// POST /api/partners
router.post('/', authenticateJWT, async (req, res) => {
    const { name, url, logo } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    try {
        const result = await query('INSERT INTO partners (name, url, logo) VALUES ($1, $2, $3) RETURNING *', [name, url, logo]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Error creating partner:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// PUT /api/partners/:id
router.put('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { name, url, logo } = req.body;
    try {
        const result = await query('UPDATE partners SET name = $1, url = $2, logo = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *', [name, url, logo, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Partner not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error updating partner:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// DELETE /api/partners/:id
router.delete('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM partners WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Partner not found' });
        }
        res.json({ message: 'Partner deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting partner:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=partners.js.map